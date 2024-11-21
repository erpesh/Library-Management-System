const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.get('/', (req, res) => {
    res.send('Hello from Wishlist Service');
});
router.post('/user/:userId/media/:mediaId', wishlistController.createWishlist);
router.get('/user/:userId', wishlistController.getWishlistByUserId);
router.delete('/:Id', wishlistController.deleteWishlistRecordById);
// router.post('/', mediaController.createMedia);
// router.get('/', mediaController.getMedia);
// router.get('/:id', mediaController.getMediaById);
// router.put('/:id', mediaController.updateMedia);
// router.delete('/:id', mediaController.deleteMedia);
// router.get('/:id/available', mediaController.checkAvailability)
// router.post('/:id/borrow', mediaController.borrowMedia)
// router.post('/:id/return', mediaController.returnMedia)

module.exports = router;
