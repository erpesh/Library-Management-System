const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.get('/user/:userId/media/:mediaId', wishlistController.getWishlistRecordByUserIdAndMediaId);
router.post('/user/:userId/media/:mediaId', wishlistController.createWishlistRecord);
router.get('/user/:userId', wishlistController.getWishlistByUserId);
router.delete('/user/:userId/record/:id', wishlistController.deleteWishlistRecordById);
router.post('/media/:mediaId', wishlistController.getRecordsByMediaIdAndNotify);

module.exports = router;
