const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middlewares/authMiddleware');
const apiKeyAuth = require('../middlewares/apiKeyAuth');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Use both middlewares - apiKeyAuth will handle if x-api-key is present, 
// otherwise it will check if authMiddleware already populated req.user
router.post('/compress', authMiddleware, apiKeyAuth, upload.single('file'), imageController.compressImage);
router.post('/resize', authMiddleware, apiKeyAuth, upload.single('file'), imageController.resizeImage);
router.post('/convert', authMiddleware, apiKeyAuth, upload.single('file'), imageController.convertImage);

module.exports = router;
