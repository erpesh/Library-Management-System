const Media = require('../models/media');

// Create a new media item
exports.createMedia = async (req, res) => {
    try {
        const media = new Media(req.body);
        await media.save();
        res.status(201).json(media);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all media items with optional filters
exports.getMedia = async (req, res) => {
    try {
        const filters = req.query;
        const mediaItems = await Media.find(filters);
        res.status(200).json(mediaItems);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMediaById = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id); // Get media by MongoDB ObjectID
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }
        res.status(200).json(media);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a media item by ID
exports.updateMedia = async (req, res) => {
    try {
        const updatedMedia = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMedia) return res.status(404).json({ error: 'Media not found' });
        res.status(200).json(updatedMedia);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a media item by ID
exports.deleteMedia = async (req, res) => {
    try {
        const deletedMedia = await Media.findByIdAndDelete(req.params.id);
        if (!deletedMedia) return res.status(404).json({ error: 'Media not found' });
        res.status(200).json({ message: 'Media deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
