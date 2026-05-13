const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pdfController = require('../controllers/pdfController');
const authMiddleware = require('../middlewares/authMiddleware');
const apiKeyAuth = require('../middlewares/apiKeyAuth');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit for PDFs
});

// All PDF processing routes support unified Auth (Session or API Key)
router.post('/merge', apiKeyAuth, upload.array('files'), pdfController.mergePDFs);
router.post('/compress', apiKeyAuth, upload.single('file'), pdfController.compressPDF);
router.post('/split', apiKeyAuth, upload.single('file'), pdfController.splitPDF);
router.post('/rotate', apiKeyAuth, upload.single('file'), pdfController.rotatePDF);
router.post('/image-to-pdf', apiKeyAuth, upload.array('files'), pdfController.imageToPDF);
router.post('/watermark', apiKeyAuth, upload.single('file'), pdfController.addWatermark);

module.exports = router;
