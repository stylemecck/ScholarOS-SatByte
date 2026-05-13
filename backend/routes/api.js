const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const authMiddleware = require('../middlewares/authMiddleware');

// All developer routes require standard login
router.use(authMiddleware);

router.post('/keys', apiController.generateKey);
router.get('/keys', apiController.listKeys);
router.delete('/keys/:id', apiController.revokeKey);
router.get('/stats/:id', apiController.getStats);

module.exports = router;
