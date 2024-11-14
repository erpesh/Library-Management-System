
// Create a new media sendWishlistNotification
exports.sendWishlistNotification = async (req, res) => {
    try {
        // Send notification
        res.status(201).json({ message: 'Notification sent successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



