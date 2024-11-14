const Media = require('../models/media');

exports.createMedia = async (req, res) => {
    try {
        const media = new Media(req.body);
        await media.save();
        res.status(201).json(media);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMedia = async (req, res) => {
    try {
        const { page = 1, perPage = 10, title, ...filters } = req.query; // Default to page 1 and 10 items per page if not provided

        const pageNumber = parseInt(page);
        const perPageNumber = parseInt(perPage);

        if (title) {
            filters.title = { $regex: title, $options: 'i' };
        }

        const skip = (pageNumber - 1) * perPageNumber;

        const mediaItems = await Media.find(filters)
            .skip(skip)        
            .limit(perPageNumber);

        const totalItems = await Media.countDocuments(filters);

        res.status(200).json({
            mediaItems,
            page: pageNumber,
            perPage: perPageNumber,
            totalItems,
            totalPages: Math.ceil(totalItems / perPageNumber)
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMediaById = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id); 
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }
        res.status(200).json(media);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateMedia = async (req, res) => {
    try {
        const updatedMedia = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMedia) return res.status(404).json({ error: 'Media not found' });
        res.status(200).json(updatedMedia);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteMedia = async (req, res) => {
    try {
        const deletedMedia = await Media.findByIdAndDelete(req.params.id);
        if (!deletedMedia) return res.status(404).json({ error: 'Media not found' });
        res.status(200).json({ message: 'Media deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
