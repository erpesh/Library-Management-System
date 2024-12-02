const WishlistRecord = require('../models/wishlist');
const { getMediaByIds } = require('../services/inventoryService');

// Create a new wishlist record
exports.createWishlistRecord = (req, res) => {
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


