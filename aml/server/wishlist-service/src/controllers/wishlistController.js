const WishlistRecord = require('../models/wishlist');
const { getMediaByIds, getEmailsByUserIds } = require('../services/inventoryService');
const { sendWishlistNotification } = require('../services/notificationService');

// Create a new wishlist record
exports.createWishlistRecord = (req, res) => {
// check for duplicate wishlist records
    WishlistRecord.findOne({ userId: req.params.userId, mediaId: req.params.mediaId })
    .then(existingRecord => {
        if (existingRecord) {
            return res.status(400).send({ message: "This item is already in the wishlist." });
        }

        const wishlist = new WishlistRecord({
            userId: req.params.userId,
            mediaId: req.params.mediaId
        });

        wishlist.save()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "An error occurred while creating the wishlist record."
                });
            });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while checking for duplicate wishlist records."
        });
    }); 
};

exports.getWishlistRecordByUserIdAndMediaId = (req, res) => {
    WishlistRecord.findOne({ userId: req.params.userId, mediaId: req.params.mediaId })
        .then(wishlist => {
            res.send(wishlist);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while retrieving the wishlist record."
            });
        });
};

// Get all wishlist records by user ID
exports.getWishlistByUserId = async (req, res) => {
    try {
        const wishlist = await WishlistRecord.find({ userId: req.params.userId });

        if (!wishlist) {
            return res.status(404).send({ message: "No wishlist records found for this user." });
        }
        
        // Call the inventory service to get the media items
        const mediaIds = wishlist.map(wishlistItem => wishlistItem.mediaId);
        const mediaItems = await getMediaByIds(mediaIds);

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
        res.status(500).send({
            message: err.message || "An error occurred while retrieving the wishlist records."
        });
    }
};

exports.deleteWishlistRecordById = async (req, res) => {
    const wishlistRecord = await WishlistRecord.findById(req.params.id);
    
    if (wishlistRecord.userId.toString() !== req.params.userId) {
        return res.status(403).send({ message: "You are not authorized to delete this wishlist record." });
    };

    WishlistRecord.findByIdAndDelete(req.params.id)
        .then(wishlist => {
            if (!wishlist) {
                return res.status(404).send({ message: "Wishlist record not found." });
            }

            res.send({ message: "Wishlist record deleted successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while deleting the wishlist record."
            });
        });
};

exports.getRecordsByMediaIdAndNotify = async (req, res) => {
    try {
        const wishlistRecords = await WishlistRecord.find({ mediaId: req.params.mediaId });

        if (!wishlistRecords.length) {
            return res.status(200).send({ message: "No wishlist records found for this mediaId." });
        }

        const [media] = await getMediaByIds([req.params.mediaId]);
        console.log('Fetched Media:', media);

        const userEmailsMap = await getEmailsByUserIds(wishlistRecords.map(record => record.userId));
        console.log('User Emails:', userEmailsMap);

        // Add user emails to wishlist records
        const wishlistRecordsWithEmails = wishlistRecords.map(record => ({
            ...record.toObject(),
            email: userEmailsMap[record.userId] || "Email not found"
        }));

        const requestObject = {
            media,
            wishlistRecords: wishlistRecordsWithEmails
        };

        // Call the notification service to send the wishlist notification
        try {
            await sendWishlistNotification(requestObject);
        } catch (notificationError) {
            console.error('Notification Error:', notificationError);
            return res.status(500).send({ message: "Failed to send notification." });
        }

        res.status(200).send({ message: "Request to Notification Service sent successfully." });
    } catch (err) {
        console.error('Controller Error:', err);
        res.status(500).send({
            message: err.message || "An error occurred while retrieving the wishlist records."
        });
    }
};
