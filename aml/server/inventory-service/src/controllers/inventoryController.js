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
        const { page = 1, perPage = 10, title, ...filters } = req.query; // Default to page 1 and 10 items per page if not provided

        // Convert page and perPage to integers
        const pageNumber = parseInt(page);
        const perPageNumber = parseInt(perPage);

        // Create a new filters object, including a regex for the title if it is provided
        if (title) {
            filters.title = { $regex: title, $options: 'i' }; // Case-insensitive match for title
        }

        // Calculate the skip value to offset the records (pagination)
        const skip = (pageNumber - 1) * perPageNumber;

        // Fetch media items with pagination
        const mediaItems = await Media.find(filters)
            .skip(skip)        // Skip the appropriate number of records
            .limit(perPageNumber); // Limit the number of records per page

        // Optionally, you could also calculate the total number of items and send it back in the response
        const totalItems = await Media.countDocuments(filters);

        // Respond with paginated results and metadata (total items, current page, etc.)
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
