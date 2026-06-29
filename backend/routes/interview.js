const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/start', interviewController.startSession);
router.post('/answer', interviewController.submitAnswer);
router.post('/compile', interviewController.compileCode);
router.get('/:interviewId/report', interviewController.finishSessionAndReport);

module.exports = router;
