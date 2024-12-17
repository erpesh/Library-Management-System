const WishlistRecord = require('../models/wishlist');
const { getMediaByIds, getEmailsByUserIds } = require('../services/inventoryService');
const { sendWishlistNotification } = require('../services/notificationService');

// Create a new wishlist record
exports.createWishlistRecord = async (req, res) => {
    try {
        // Check for duplicate wishlist records
        const existingRecord = await WishlistRecord.findOne({ userId: req.params.userId, mediaId: req.params.mediaId });
        if (existingRecord) {
            return res.status(400).send({ message: "This item is already in the wishlist." });
        }

        const wishlist = new WishlistRecord({
            userId: req.params.userId,
            mediaId: req.params.mediaId
        });

        const data = await wishlist.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || "An error occurred while creating the wishlist record." });
    }
};

// Get a specific wishlist record by userId and mediaId
exports.getWishlistRecordByUserIdAndMediaId = async (req, res) => {
    try {
        const wishlist = await WishlistRecord.findOne({ userId: req.params.userId, mediaId: req.params.mediaId });
        if (!wishlist) {
            return res.status(404).send({ message: "Wishlist record not found." });
        }
        res.send(wishlist);
    } catch (err) {
        res.status(500).send({ message: err.message || "An error occurred while retrieving the wishlist record." });
    }
};

// Get all wishlist records by userId
exports.getWishlistByUserId = async (req, res) => {
    try {
        const wishlist = await WishlistRecord.find({ userId: req.params.userId });
        if (!wishlist || wishlist.length === 0) {
            return res.status(404).send({ message: "No wishlist records found for this user." });
        }

        // Call the inventory service to get the media items
        const mediaIds = wishlist.map(wishlistItem => wishlistItem.mediaId);
        const mediaItems = await getMediaByIds(mediaIds);
        if (!mediaItems || mediaItems.length === 0) {
            return res.status(404).send({ message: "Media items not found." });
        }

        const wishlistItems = wishlist.map(wishlistItem => {
            const mediaItem = mediaItems.find(mediaItem => mediaItem._id.toString() === wishlistItem.mediaId.toString());
            return {
                _id: wishlistItem._id,
                userId: wishlistItem.userId,
                mediaId: wishlistItem.mediaId,
                createdAt: wishlistItem.createdAt,
                media: mediaItem,
            };
        });

        res.status(200).send(wishlistItems);
    } catch (err) {
        res.status(500).send({ message: err.message || "An error occurred while retrieving the wishlist records." });
    }
};

// Delete a wishlist record by ID
exports.deleteWishlistRecordById = async (req, res) => {
    try {
        const wishlistRecord = await WishlistRecord.findById(req.params.id);
        if (!wishlistRecord) {
            return res.status(404).send({ message: "Wishlist record not found." });
        }

        if (wishlistRecord.userId.toString() !== req.params.userId) {
            return res.status(403).send({ message: "You are not authorized to delete this wishlist record." });
        }

        await wishlistRecord.remove();
        res.send({ message: "Wishlist record deleted successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message || "An error occurred while deleting the wishlist record." });
    }
};

// Get wishlist records by mediaId and notify users
exports.getRecordsByMediaIdAndNotify = async (req, res) => {
    try {
        const wishlistRecords = await WishlistRecord.find({ mediaId: req.params.mediaId });
        if (!wishlistRecords || wishlistRecords.length === 0) {
            return res.status(200).send({ message: "No wishlist records found for this mediaId." });
        }

        const [media] = await getMediaByIds([req.params.mediaId]);
        if (!media) {
            return res.status(404).send({ message: "Media not found." });
        }

        const userEmailsMap = await getEmailsByUserIds(wishlistRecords.map(record => record.userId));
        if (!userEmailsMap) {
            return res.status(500).send({ message: "Failed to retrieve user emails." });
        }

        // Add user emails to wishlist records
        const wishlistRecordsWithEmails = wishlistRecords.map(record => ({
            ...record.toObject(),
            email: userEmailsMap[record.userId]
        }));

        // Call the notification service to send the wishlist notification
        await sendWishlistNotification({ media, wishlistRecords: wishlistRecordsWithEmails });

        res.status(200).send({ message: "Request to Notification Service sent successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message || "An error occurred while retrieving the wishlist records." });
    }
};
