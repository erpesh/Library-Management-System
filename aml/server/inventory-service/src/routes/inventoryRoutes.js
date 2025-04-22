const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const userController = require('../controllers/usersController');
const { authenticateToken, requireAdmin } = require('../utils/authMiddleware');
const { mediaSearchLimiter } = require('../utils/rateLimiter');

// Public route (no auth required)
router.get('/emails', userController.getEmailsByUserIds);

// Routes requiring any authenticated user
router.post('/:id/borrow', authenticateToken, inventoryController.borrowMedia);
router.post('/:id/return', authenticateToken, inventoryController.returnMedia);

// Admin-only routes
router.post('/', authenticateToken, requireAdmin, inventoryController.createMedia);
router.put('/:id', authenticateToken, requireAdmin, inventoryController.updateMedia);
router.delete('/:id', authenticateToken, requireAdmin, inventoryController.deleteMedia);

// Public or optional-auth routes
router.get('/', mediaSearchLimiter, inventoryController.getMedia);
router.get('/:id', inventoryController.getMediaById);
router.get('/:id/available', inventoryController.checkAvailability);

module.exports = router;
