const WishlistRecord = require('../models/wishlist');

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

        res.status(200).send(wishlist);
    } catch (err) {
        res.status(500).send({
            message: err.message || "An error occurred while retrieving the wishlist records."
        });
    }
};


// Delete a single wishlist record by ID
exports.deleteWishlistRecordById = (req, res) => {
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


