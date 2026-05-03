const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middlewares/authMiddleware');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/compress', upload.single('file'), imageController.compressImage);
router.post('/resize', upload.single('file'), imageController.resizeImage);
router.post('/convert', upload.single('file'), imageController.convertImage);

module.exports = router;
