const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.post('/user/:userId/media/:mediaId', wishlistController.createWishlistRecord);
router.get('/user/:userId', wishlistController.getWishlistByUserId);
router.delete('/user/:userId/record/:id', wishlistController.deleteWishlistRecordById);

module.exports = router;
