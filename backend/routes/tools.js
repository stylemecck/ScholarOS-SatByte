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
router.delete('/delete-result/:id', authMiddleware, toolsController.deleteResult);
router.post('/deduct-credits', authMiddleware, toolsController.deductCredits);
router.post('/chat', (req, res, next) => {
    // Optional auth: if token exists, verify it, but don't block if missing
    const authHeader = req.headers.authorization;
    if (authHeader) return authMiddleware(req, res, next);
    next();
}, toolsController.chat);
router.post('/generate-pdf', toolsController.generatePdf);
router.post('/export-counseling-pdf', authMiddleware, toolsController.exportCounselingPdf);

module.exports = router;
