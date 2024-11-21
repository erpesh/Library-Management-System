const WishlistRecord = require('../models/wishlist');

// Create a new wishlist record
exports.createWishlist = (req, res) => {
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
exports.getWishlistByUserId = (req, res) => {
    WishlistRecord.find({ userId: req.params.userId })
        .then(wishlist => {
            // Make request to inventory-service to get media data for each media ID
            

            res.send(wishlist);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while retrieving the wishlist records."
            });
        });
};

// Delete a single wishlist record by ID
exports.deleteWishlistRecordById = (req, res) => {
    WishlistRecord.findByIdAndDelete(req.params.Id)
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


