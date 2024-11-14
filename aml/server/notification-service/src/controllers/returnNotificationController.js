

// Create a new media returnNotificationController
exports.sendReturnNotification = async (req, res) => {
    try {
        const media = new Media(req.body);
        await media.save();
        res.status(201).json(media);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



