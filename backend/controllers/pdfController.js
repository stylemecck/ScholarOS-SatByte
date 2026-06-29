const { PDFDocument } = require('pdf-lib');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const os = require('os');

/**
 * Merge multiple PDF files into one
 */
exports.mergePDFs = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least two PDF files to merge.' });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdfBytes = file.buffer;
      const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged_stp.pdf');
    res.send(Buffer.from(mergedPdfBytes));
  } catch (err) {
    console.error('Merge PDF Error:', err);
    res.status(500).json({ error: 'Failed to merge PDF files.', details: err.message });
  }
};

/**
 * Compress PDF by reducing quality (simplified version)
 */
exports.compressPDF = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Please upload a PDF file to compress.' });
    }

    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    
    const compressedPdfBytes = await pdfDoc.save({ 
      useObjectStreams: true,
      addDefaultPage: false 
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=compressed_stp.pdf');
    res.send(Buffer.from(compressedPdfBytes));
  } catch (err) {
    console.error('Compress PDF Error:', err);
    res.status(500).json({ error: 'Failed to compress PDF.', details: err.message });
  }
};

/**
 * Split PDF into individual pages
 */
exports.splitPDF = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Please upload a PDF file to split.' });
    }

    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    if (pageCount <= 1) {
      return res.status(400).json({ error: 'PDF must have more than one page to split.' });
    }

    // Create a zip file to hold all pages
    const archive = archiver('zip', { zlib: { level: 9 } });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=split_pages_stp.zip');
    archive.pipe(res);

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      const bytes = await newPdf.save();
      archive.append(Buffer.from(bytes), { name: `page_${i + 1}.pdf` });
    }

    await archive.finalize();
  } catch (err) {
    console.error('Split PDF Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to split PDF.', details: err.message });
    }
  }
};

/**
 * Rotate PDF pages
 */
exports.rotatePDF = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'Please upload a PDF file.' });
    const rotation = parseInt(req.body.rotation) || 90;

    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();

    pages.forEach(page => {
      const currentRotation = page.getRotation().angle;
      page.setRotation({ angle: (currentRotation + rotation) % 360 });
    });

    const rotatedPdfBytes = await pdfDoc.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rotated_stp.pdf');
    res.send(Buffer.from(rotatedPdfBytes));
  } catch (err) {
    console.error('Rotate PDF Error:', err);
    res.status(500).json({ error: 'Failed to rotate PDF.' });
  }
};

/**
 * Convert Image to PDF
 */
exports.imageToPDF = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one image.' });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      const imageBytes = file.buffer;
      let image;
      
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (file.mimetype === 'image/png') {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        continue; // Skip unsupported types
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=images_to_pdf_stp.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('Image to PDF Error:', err);
    res.status(500).json({ error: 'Failed to convert images to PDF.' });
  }
};

/**
 * Add Watermark to PDF
 */
exports.addWatermark = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: 'Please upload a PDF file.' });
    const text = req.body.text || 'ScholarOS';
    const opacity = parseFloat(req.body.opacity) || 0.3;

    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 4,
        y: height / 2,
        size: 50,
        opacity: opacity,
        rotate: { angle: 45, type: 'degrees' },
      });
    }

    const watermarkedPdfBytes = await pdfDoc.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=watermarked_stp.pdf');
    res.send(Buffer.from(watermarkedPdfBytes));
  } catch (err) {
    console.error('Watermark PDF Error:', err);
    res.status(500).json({ error: 'Failed to add watermark.' });
  }
};
