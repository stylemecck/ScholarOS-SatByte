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
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    
    // Cleanup uploaded files
    req.files.forEach(file => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });

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
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file to compress.' });
    }

    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // In pdf-lib, "compression" is mostly done by removing metadata or 
    // using efficient objects. True image compression requires more complex logic.
    // For now, we'll re-save it with compression enabled.
    const compressedPdfBytes = await pdfDoc.save({ 
      useObjectStreams: true,
      addDefaultPage: false 
    });

    // Cleanup
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

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
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file to split.' });
    }

    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
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

    // Cleanup
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  } catch (err) {
    console.error('Split PDF Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to split PDF.', details: err.message });
    }
  }
};
