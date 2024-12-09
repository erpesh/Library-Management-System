const wishlistNotificationController = require('../controllers/wishlistNotificationController');
const returnNotificationController = require('../controllers/returnNotificationController');

const express = require('express');
const router = express.Router();

router.post('/send-wishlist', wishlistNotificationController.sendWishlistNotification); // Ensure this matches the exported function
router.post('/send-return', returnNotificationController.sendReturnNotification);



module.exports = router;
