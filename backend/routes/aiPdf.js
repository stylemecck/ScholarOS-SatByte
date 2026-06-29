const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiPdfController = require('../controllers/aiPdfController');
const authMiddleware = require('../middlewares/authMiddleware');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

router.use(authMiddleware);

router.post('/upload', upload.single('file'), aiPdfController.uploadDocument);
router.get('/', aiPdfController.getDocuments);
router.delete('/:id', aiPdfController.deleteDocument);
router.put('/:id/favorite', aiPdfController.toggleFavorite);
router.post('/chat', aiPdfController.chatWithDocument);
router.post('/compare', aiPdfController.compareDocuments);
router.post('/features', aiPdfController.generateDocumentFeatures);
router.post('/:id/annotation', aiPdfController.addAnnotation);
router.put('/:id/progress', aiPdfController.updateReadingProgress);

module.exports = router;
