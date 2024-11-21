const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/inventoryController');

router.post('/', mediaController.createMedia);
router.get('/', mediaController.getMedia);
router.get('/:id', mediaController.getMediaById);
router.put('/:id', mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);
router.get('/:id/available', mediaController.checkAvailability)
router.post('/:id/borrow', mediaController.borrowMedia)
router.post('/:id/return', mediaController.returnMedia)

module.exports = router;
