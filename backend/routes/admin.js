const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/stats', protect, admin, adminController.getStats);
router.get('/users', protect, admin, adminController.getUsers);
router.get('/users/:userId', protect, admin, adminController.getUserDetails);

module.exports = router;
