const express = require('express');
const router = express.Router();
const multer = require('multer');
const toolsController = require('../controllers/toolsController');
const authMiddleware = require('../middlewares/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/pdf-to-text', upload.single('pdf'), toolsController.parsePdf);
router.post('/predict-rank', toolsController.predictRank);
router.post('/predict-percentile', toolsController.predictPercentile);
router.post('/generate-summary', toolsController.generateResumeSummary);
router.post('/enhance-bullet', toolsController.enhanceResumeBullet);
router.post('/save-result', authMiddleware, toolsController.saveResult);
router.post('/generate-pdf', toolsController.generatePdf);

module.exports = router;
