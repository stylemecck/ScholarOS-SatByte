const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/compress', upload.single('file'), imageController.compressImage);
router.post('/resize', upload.single('file'), imageController.resizeImage);
router.post('/convert', upload.single('file'), imageController.convertImage);

module.exports = router;
