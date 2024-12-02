const mongoose = require('mongoose');
const Media = require('../models/media');
const { checkMediaBorrowingStatus } = require('../services/mediaService');

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
        const { page = 1, perPage = 8, title, ids, ...filters } = req.query;
        const pageNumber = parseInt(page);
        const perPageNumber = parseInt(perPage);

        if (ids) {
            const idArray = ids.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));
            filters._id = { $in: idArray };
        }

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

        const userID = req.query.userId;

        let responseData = media.toObject();

        if (userID) {
            // Fetch borrowing status for the media item
            const borrowingStatus = await checkMediaBorrowingStatus(userID, media._id);

            // Merge borrowing status with the media data
            responseData = {
                ...responseData,
                isBorrowed: borrowingStatus.isBorrowed,
                borrowingRecord: borrowingStatus.borrowingRecord
            };
        }

        // Send the combined response
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching media or borrowing status:', error);
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

exports.checkAvailability = async (req, res) => {
    try {
        const mediaItem = await Media.findById(req.params.id);
        if (!mediaItem) return res.status(404).json({ error: 'Media not found' });

        if (mediaItem.borrowed < mediaItem.stock) {
            return res.status(200).json({ available: true });
        } else {
            return res.status(200).json({ available: false });
        }

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

exports.borrowMedia = async (req, res) => {
    try {
        const mediaItem = await Media.findById(req.params.id);
        if (!mediaItem) return res.status(404).json({ error: 'Media not found' });

        if (mediaItem.borrowed < mediaItem.stock) {
            mediaItem.borrowed += 1;
            await mediaItem.save();
            return res.status(200).json({ message: 'Media borrowed successfully' });
        } else {
            return res.status(400).json({ error: 'Media not available for borrowing' });
        }

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

exports.returnMedia = async (req, res) => {
    try {
        const mediaItem = await Media.findById(req.params.id);
        if (!mediaItem) return res.status(404).json({ error: 'Media not found' });

        if (mediaItem.borrowed > 0) {
            mediaItem.borrowed -= 1;
            await mediaItem.save();
            return res.status(200).json({ message: 'Media returned successfully' });
        } else {
            return res.status(400).json({ error: 'No borrowed media to return' });
        }

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

