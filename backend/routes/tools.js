const express = require('express');
const router = express.Router();
const multer = require('multer');
const toolsController = require('../controllers/toolsController');
const authMiddleware = require('../middlewares/authMiddleware');
const apiKeyAuth = require('../middlewares/apiKeyAuth');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/exams-config', toolsController.getExamsConfig);
router.post('/pdf-to-text', apiKeyAuth, upload.single('pdf'), toolsController.parsePdf);
router.post('/predict-rank', apiKeyAuth, toolsController.predictRank);
router.post('/predict-percentile', toolsController.predictPercentile);
router.post('/generate-summary', apiKeyAuth, toolsController.generateResumeSummary);
router.post('/enhance-bullet', apiKeyAuth, toolsController.enhanceResumeBullet);
router.post('/save-result', authMiddleware, toolsController.saveResult);
router.delete('/delete-result/:id', authMiddleware, toolsController.deleteResult);
router.post('/deduct-credits', authMiddleware, toolsController.deductCredits);
router.post('/chat', apiKeyAuth, toolsController.chat);
router.post('/generate-pdf', toolsController.generatePdf);
router.post('/export-counseling-pdf', authMiddleware, toolsController.exportCounselingPdf);
router.post('/export-resume-pdf', apiKeyAuth, toolsController.exportResumePdf);

module.exports = router;
