const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Compress Image
 */
exports.compressImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image to compress.' });
    }

    const quality = parseInt(req.body.quality) || 70;
    const format = req.file.mimetype.split('/')[1]; // e.g. jpeg, png

    let pipeline = sharp(req.file.path);

    if (format === 'jpeg' || format === 'jpg') {
      pipeline = pipeline.jpeg({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality, compressionLevel: 9 });
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    }

    const outputBuffer = await pipeline.toBuffer();

    // Cleanup
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.setHeader('Content-Type', req.file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename=compressed_stp.${format}`);
    res.send(outputBuffer);
  } catch (err) {
    console.error('Compress Image Error:', err);
    res.status(500).json({ error: 'Failed to compress image.', details: err.message });
  }
};

/**
 * Resize Image
 */
exports.resizeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image to resize.' });
    }

    const width = parseInt(req.body.width);
    const height = parseInt(req.body.height);

    if (!width && !height) {
      return res.status(400).json({ error: 'Please provide at least width or height.' });
    }

    const format = req.file.mimetype.split('/')[1];
    const outputBuffer = await sharp(req.file.path)
      .resize(width || null, height || null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    // Cleanup
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.setHeader('Content-Type', req.file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename=resized_stp.${format}`);
    res.send(outputBuffer);
  } catch (err) {
    console.error('Resize Image Error:', err);
    res.status(500).json({ error: 'Failed to resize image.', details: err.message });
  }
};

/**
 * Convert Image Format
 */
exports.convertImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image to convert.' });
    }

    const targetFormat = req.body.targetFormat; // jpeg, png, webp
    if (!['jpeg', 'jpg', 'png', 'webp'].includes(targetFormat)) {
      return res.status(400).json({ error: 'Invalid target format.' });
    }

    const outputBuffer = await sharp(req.file.path)
      .toFormat(targetFormat === 'jpg' ? 'jpeg' : targetFormat)
      .toBuffer();

    // Cleanup
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.setHeader('Content-Type', `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`);
    res.setHeader('Content-Disposition', `attachment; filename=converted_stp.${targetFormat}`);
    res.send(outputBuffer);
  } catch (err) {
    console.error('Convert Image Error:', err);
    res.status(500).json({ error: 'Failed to convert image.', details: err.message });
  }
};
