
// Create a new media sendWishlistNotification
exports.sendReturnNotification = async (req, res) => {
    try {
        // Send notification
        res.status(201).json({ message: '`You returned a book`' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



