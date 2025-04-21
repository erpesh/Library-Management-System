const mongoose = require('mongoose');
const Media = require('../models/media');
const { checkMediaBorrowingStatus } = require('../services/mediaService');
const { getWishlistRecord, getWishlistRecordsByMediaIdAndNotify } = require('../services/wishlistService');

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
      const token = req.headers.authorization?.split(" ")[1];
      console.log("Token:", token); // Debugging line
      console.log('Req headers:', req.headers); // Debugging line
  
      let responseData = media.toObject();
  
      if (userID) {
        const borrowingStatus = await checkMediaBorrowingStatus(userID, media._id, token);
  
        responseData = {
          ...responseData,
          isBorrowed: borrowingStatus?.isBorrowed ?? false,
          borrowingRecord: borrowingStatus?.borrowingRecord || null,
        };
  
        const wishlistRecord = await getWishlistRecord(userID, media._id);
        responseData = {
          ...responseData,
          wishlistRecord: wishlistRecord,
        };
      }
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching media or borrowing status:', error);
      res.status(400).json({ error: error.message });
    }
  };

exports.updateMedia = async (req, res) => {
    try {
        // Fetch the current media object by ID
        const currentMedia = await Media.findById(req.params.id);
        if (!currentMedia) return res.status(404).json({ error: 'Media not found' });

        const { stock: currentStock, borrowed: currentBorrowed } = currentMedia;

        // Check if media became available with the update
        if (currentStock === currentBorrowed && req.body.stock > currentStock) {
            await getWishlistRecordsByMediaIdAndNotify(req.params.id);
        }

        const updatedMedia = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    console.log('Borrow media request:', req.headers); // Debugging line   
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

