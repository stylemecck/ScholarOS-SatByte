const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');

router.post('/create-order', optionalAuthMiddleware, paymentController.createOrder);
router.post('/verify', optionalAuthMiddleware, paymentController.verifyPayment);
router.post('/verify-payment', optionalAuthMiddleware, paymentController.verifyPayment);

module.exports = router;
