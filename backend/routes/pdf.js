const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pdfController = require('../controllers/pdfController');
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

router.post('/merge', upload.array('files'), pdfController.mergePDFs);
router.post('/compress', upload.single('file'), pdfController.compressPDF);
router.post('/split', upload.single('file'), pdfController.splitPDF);

module.exports = router;
