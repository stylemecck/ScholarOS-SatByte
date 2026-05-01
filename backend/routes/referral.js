const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/network', authMiddleware, referralController.getReferralNetwork);

module.exports = router;
