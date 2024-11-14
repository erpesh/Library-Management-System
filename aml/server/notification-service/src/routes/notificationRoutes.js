const wishlistNotificationController = require('../controllers/wishlistNotificationController');
const returnNotificationController = require('../controllers/returnNotificationController');

const express = require('express');
const router = express.Router();


router.post('/send-wishlist', wishlistNotificationController.sendWishlistNotification);
router.post('/send-return', returnNotificationController.sendReturnNotification);

module.exports = router;