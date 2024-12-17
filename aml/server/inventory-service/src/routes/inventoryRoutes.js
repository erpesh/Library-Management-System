const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const userController = require('../controllers/usersController');

router.get('/emails', userController.getEmailsByUserIds)

router.post('/', inventoryController.createMedia);
router.get('/', inventoryController.getMedia);
router.get('/:id', inventoryController.getMediaById);
router.put('/:id', inventoryController.updateMedia);
router.delete('/:id', inventoryController.deleteMedia);
router.get('/:id/available', inventoryController.checkAvailability)
router.post('/:id/borrow', inventoryController.borrowMedia)
router.post('/:id/return', inventoryController.returnMedia)

module.exports = router;
