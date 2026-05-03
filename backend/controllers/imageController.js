const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Compress Image
 */
exports.compressImage = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Please upload an image to compress.' });
    }

    const targetSizeKB = parseInt(req.body.targetSize);
    let quality = parseInt(req.body.quality) || 75;
    const format = req.file.mimetype.split('/')[1].toLowerCase();

    let buffer;

    // If targetSize is provided, we might need multiple passes (simple version)
    if (targetSizeKB && targetSizeKB > 0) {
      const targetBytes = targetSizeKB * 1024;
      let lastBuffer;
      
      // Try high quality first
      for (let q = 80; q >= 10; q -= 10) {
        let p = sharp(req.file.buffer);
        if (format === 'png') {
            lastBuffer = await p.png({ quality: q, compressionLevel: 9 }).toBuffer();
        } else if (format === 'webp') {
            lastBuffer = await p.webp({ quality: q }).toBuffer();
        } else {
            lastBuffer = await p.jpeg({ quality: q, mozjpeg: true }).toBuffer();
        }

        if (lastBuffer.length <= targetBytes) {
          buffer = lastBuffer;
          break;
        }
        buffer = lastBuffer; // Keep at least the lowest quality one
      }
    } else {
      let p = sharp(req.file.buffer);
      if (format === 'jpeg' || format === 'jpg') {
        buffer = await p.jpeg({ quality, mozjpeg: true }).toBuffer();
      } else if (format === 'png') {
        buffer = await p.png({ quality, compressionLevel: 9 }).toBuffer();
      } else if (format === 'webp') {
        buffer = await p.webp({ quality }).toBuffer();
      } else if (format === 'heic' || format === 'heif') {
        buffer = await p.jpeg({ quality }).toBuffer(); // Convert HEIC to JPEG for compatibility
      } else {
        // Fallback for other formats
        buffer = await p.jpeg({ quality }).toBuffer();
      }
    }

    res.setHeader('Content-Type', buffer.length > 0 ? (format === 'png' ? 'image/png' : (format === 'webp' ? 'image/webp' : 'image/jpeg')) : req.file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename=compressed_stp.${format === 'png' ? 'png' : (format === 'webp' ? 'webp' : 'jpg')}`);
    res.send(buffer);
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
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Please upload an image to resize.' });
    }

    const width = parseInt(req.body.width);
    const height = parseInt(req.body.height);

    if (!width && !height) {
      return res.status(400).json({ error: 'Please provide at least width or height.' });
    }

    const format = req.file.mimetype.split('/')[1].toLowerCase();
    const outputBuffer = await sharp(req.file.buffer)
      .resize(width || null, height || null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat(format === 'png' ? 'png' : (format === 'webp' ? 'webp' : 'jpeg'))
      .toBuffer();

    res.setHeader('Content-Type', format === 'png' ? 'image/png' : (format === 'webp' ? 'image/webp' : 'image/jpeg'));
    res.setHeader('Content-Disposition', `attachment; filename=resized_stp.${format === 'png' ? 'png' : (format === 'webp' ? 'webp' : 'jpg')}`);
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
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Please upload an image to convert.' });
    }

    const targetFormat = req.body.targetFormat?.toLowerCase(); // jpeg, png, webp
    if (!['jpeg', 'jpg', 'png', 'webp'].includes(targetFormat)) {
      return res.status(400).json({ error: 'Invalid target format.' });
    }

    const outputBuffer = await sharp(req.file.buffer)
      .toFormat(targetFormat === 'jpg' ? 'jpeg' : targetFormat)
      .toBuffer();

    res.setHeader('Content-Type', `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`);
    res.setHeader('Content-Disposition', `attachment; filename=converted_stp.${targetFormat}`);
    res.send(outputBuffer);
  } catch (err) {
    console.error('Convert Image Error:', err);
    res.status(500).json({ error: 'Failed to convert image.', details: err.message });
  }
};
