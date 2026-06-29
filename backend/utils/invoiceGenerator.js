const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const crypto = require('crypto');

/**
 * Generate a professional, GST-compliant invoice PDF
 * @param {Object} user User profile details
 * @param {Object} order Razorpay order details
 * @param {Object} paymentDetails Razorpay payment transaction details
 * @returns {Buffer} PDF buffer
 */
exports.generateInvoicePDF = async (user, order, paymentDetails) => {
  try {
    const pdfDoc = await PDFDocument.create();
    
    // Create an A4 page (595.276 x 841.89 points)
    const page = pdfDoc.addPage([595.276, 841.89]);
    const { width, height } = page.getSize();
    
    // Embed standard fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Setup Colors
    const textDark = rgb(0.1, 0.1, 0.1);
    const textMuted = rgb(0.4, 0.4, 0.4);
    const primaryBlue = rgb(0.23, 0.51, 0.96); // #3B82F6
    const bgLight = rgb(0.96, 0.96, 0.96);
    const bgHeader = rgb(0.06, 0.06, 0.08); // Sleek dark slate
    const borderMuted = rgb(0.85, 0.85, 0.85);

    // 1. Sleek Dark Header Banner
    page.drawRectangle({
      x: 0,
      y: height - 100,
      width: width,
      height: 100,
      color: bgHeader
    });

    page.drawText("SCHOLAROS", {
      x: 40,
      y: height - 60,
      size: 24,
      font: helveticaBold,
      color: rgb(1, 1, 1)
    });

    page.drawText("TAX INVOICE", {
      x: width - 180,
      y: height - 58,
      size: 18,
      font: helveticaBold,
      color: rgb(1, 1, 1)
    });
    
    page.drawText("Indian GST Compliant Services", {
      x: 40,
      y: height - 80,
      size: 10,
      font: helvetica,
      color: rgb(0.7, 0.7, 0.7)
    });

    // 2. Seller and Invoice Meta Columns
    let yPos = height - 140;

    // Seller Column (Left)
    page.drawText("Sold By / Provider:", { x: 40, y: yPos, size: 10, font: helveticaBold, color: primaryBlue });
    page.drawText("SatByte Technologies Private Limited", { x: 40, y: yPos - 15, size: 9, font: helveticaBold, color: textDark });
    page.drawText("Ward No. 07, Sarmastpur Jhitkahi (Shamil), Vaishali, Bihar - 844122", { x: 40, y: yPos - 27, size: 7.5, font: helvetica, color: textMuted });
    page.drawText("GSTIN: 10AAAAA1111A1Z1 (Mock Bihar)", { x: 40, y: yPos - 39, size: 8, font: helvetica, color: textMuted });
    page.drawText("Email: billing@studenttoolkitpro.com", { x: 40, y: yPos - 51, size: 8, font: helvetica, color: textMuted });

    // Invoice Meta Column (Right)
    const invoiceNo = `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(paymentDetails.razorpay_payment_id || 'TXT').slice(-6).toUpperCase()}`;
    const invoiceDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    page.drawText("Invoice Details:", { x: width - 230, y: yPos, size: 10, font: helveticaBold, color: primaryBlue });
    page.drawText(`Invoice No: ${invoiceNo}`, { x: width - 230, y: yPos - 15, size: 9, font: helveticaBold, color: textDark });
    page.drawText(`Invoice Date: ${invoiceDate}`, { x: width - 230, y: yPos - 27, size: 8, font: helvetica, color: textMuted });
    page.drawText(`Order ID: ${paymentDetails.razorpay_order_id || 'N/A'}`, { x: width - 230, y: yPos - 39, size: 8, font: helvetica, color: textMuted });
    page.drawText(`Transaction ID: ${paymentDetails.razorpay_payment_id || 'N/A'}`, { x: width - 230, y: yPos - 51, size: 8, font: helvetica, color: textMuted });

    // Draw horizontal divider line
    yPos -= 75;
    page.drawLine({
      start: { x: 40, y: yPos },
      end: { x: width - 40, y: yPos },
      thickness: 1,
      color: borderMuted
    });

    // 3. Bill To Customer Column
    yPos -= 25;
    page.drawText("Bill To / Recipient:", { x: 40, y: yPos, size: 11, font: helveticaBold, color: primaryBlue });
    
    // Format Address
    const address = user.address || {};
    const addressStr = `${address.line1 || 'N/A'}, ${address.city || ''}, ${address.state || ''} - ${address.postalCode || ''}, ${address.country || 'India'}`;

    page.drawText(`Name: ${user.name}`, { x: 40, y: yPos - 18, size: 10, font: helveticaBold, color: textDark });
    page.drawText(`Email: ${user.email}`, { x: 40, y: yPos - 30, size: 9, font: helvetica, color: textDark });
    page.drawText(`Mobile: ${user.phoneNumber || 'N/A'}`, { x: 40, y: yPos - 42, size: 9, font: helvetica, color: textDark });
    page.drawText(`Billing Address: ${addressStr}`, { x: 40, y: yPos - 54, size: 9, font: helvetica, color: textDark });
    page.drawText(`Place of Supply: ${address.state || 'Haryana'}`, { x: 40, y: yPos - 66, size: 9, font: helvetica, color: textMuted });

    // Draw table boundary
    yPos -= 95;

    // 4. Invoice Table Columns
    // Draw table header block
    page.drawRectangle({
      x: 40,
      y: yPos - 20,
      width: width - 80,
      height: 25,
      color: bgLight
    });

    // Table Headers
    page.drawText("Item / Description", { x: 50, y: yPos - 13, size: 9, font: helveticaBold, color: textDark });
    page.drawText("SAC / HSN", { x: 280, y: yPos - 13, size: 9, font: helveticaBold, color: textDark });
    page.drawText("Qty", { x: 360, y: yPos - 13, size: 9, font: helveticaBold, color: textDark });
    page.drawText("Rate (INR)", { x: 410, y: yPos - 13, size: 9, font: helveticaBold, color: textDark });
    page.drawText("Amount (INR)", { x: 500, y: yPos - 13, size: 9, font: helveticaBold, color: textDark });

    // Parse product details based on order notes
    const credits = order.notes?.credits || '100';
    const planName = credits === '12000' || credits === '1000' ? 'Business' : 'Pro';
    const duration = credits === '12000' || credits === '1200' ? 'Yearly' : 'Monthly';
    
    // Financial calculations
    const totalPrice = (order.amount ? order.amount / 100 : 99); // Razorpay order amount is in paise
    const basePrice = parseFloat((totalPrice / 1.18).toFixed(2));
    const cgst = parseFloat((basePrice * 0.09).toFixed(2));
    const sgst = parseFloat((basePrice * 0.09).toFixed(2));
    const totalGst = parseFloat((cgst + sgst).toFixed(2));

    const itemDescription = `ScholarOS - ${planName} ${duration} SaaS Plan (+${credits} Credits)`;

    // Draw single row item
    yPos -= 45;
    page.drawText(itemDescription, { x: 50, y: yPos, size: 9, font: helveticaBold, color: textDark });
    page.drawText("998311", { x: 280, y: yPos, size: 9, font: helvetica, color: textDark });
    page.drawText("1", { x: 360, y: yPos, size: 9, font: helvetica, color: textDark });
    page.drawText(`Rs. ${basePrice}`, { x: 410, y: yPos, size: 9, font: helvetica, color: textDark });
    page.drawText(`Rs. ${basePrice}`, { x: 500, y: yPos, size: 9, font: helvetica, color: textDark });

    // Table Underline divider
    yPos -= 15;
    page.drawLine({
      start: { x: 40, y: yPos },
      end: { x: width - 40, y: yPos },
      thickness: 0.5,
      color: borderMuted
    });

    // 5. Calculations Summary Grid
    yPos -= 25;
    const summaryLabelX = width - 210;
    const summaryValueX = width - 110;

    page.drawText("Base Amount (Subtotal):", { x: summaryLabelX, y: yPos, size: 9, font: helvetica, color: textMuted });
    page.drawText(`Rs. ${basePrice}`, { x: summaryValueX, y: yPos, size: 9, font: helvetica, color: textDark });

    page.drawText("CGST @ 9.0%:", { x: summaryLabelX, y: yPos - 15, size: 9, font: helvetica, color: textMuted });
    page.drawText(`Rs. ${cgst}`, { x: summaryValueX, y: yPos - 15, size: 9, font: helvetica, color: textDark });

    page.drawText("SGST @ 9.0%:", { x: summaryLabelX, y: yPos - 30, size: 9, font: helvetica, color: textMuted });
    page.drawText(`Rs. ${sgst}`, { x: summaryValueX, y: yPos - 30, size: 9, font: helvetica, color: textDark });

    page.drawText("Total Tax Amount (18%):", { x: summaryLabelX, y: yPos - 45, size: 9, font: helvetica, color: textMuted });
    page.drawText(`Rs. ${totalGst}`, { x: summaryValueX, y: yPos - 45, size: 9, font: helvetica, color: textDark });

    // Grand total background bar
    yPos -= 72;
    page.drawRectangle({
      x: summaryLabelX - 20,
      y: yPos - 5,
      width: width - (summaryLabelX - 20) - 40,
      height: 25,
      color: primaryBlue
    });

    page.drawText("Grand Total (Paid):", { x: summaryLabelX, y: yPos, size: 10, font: helveticaBold, color: rgb(1, 1, 1) });
    page.drawText(`Rs. ${totalPrice.toFixed(2)}`, { x: summaryValueX, y: yPos, size: 10, font: helveticaBold, color: rgb(1, 1, 1) });

    // 6. Professional Declarations & Digitally Signed Block
    yPos -= 75;
    
    // Left Box: Terms & Declarations
    page.drawRectangle({
      x: 40,
      y: yPos - 50,
      width: 320,
      height: 55,
      color: bgLight
    });

    page.drawText("Terms & Declarations:", { x: 50, y: yPos - 10, size: 8, font: helveticaBold, color: textDark });
    page.drawText("1. HSN SAC description matches standard SaaS digital plans.", { x: 50, y: yPos - 22, size: 7.2, font: helvetica, color: textMuted });
    page.drawText("2. Taxes are calculated as per CGST/SGST rules under India's GST norms.", { x: 50, y: yPos - 32, size: 7.2, font: helvetica, color: textMuted });
    page.drawText("3. This document is authenticated by verified electronic signature below.", { x: 50, y: yPos - 42, size: 7.2, font: helvetica, color: textMuted });

    // Right Box: Visual Digital Signature stamp
    const sigGreen = rgb(0.13, 0.58, 0.28); // Standard green stamp color
    const sigBg = rgb(0.94, 0.98, 0.95);
    
    page.drawRectangle({
      x: 375,
      y: yPos - 50,
      width: 180,
      height: 55,
      color: sigBg,
      borderColor: sigGreen,
      borderLineWidth: 1
    });

    // Hash values from payment details
    const paymentId = paymentDetails.razorpay_payment_id || 'MOCKPAYID';
    const mockHash = `SHA256:${crypto.createHash('sha256').update(paymentId).digest('hex').slice(0, 16).toUpperCase()}`;

    // Draw a vector green checkmark to avoid WinAnsi font encoding limitations
    page.drawLine({
      start: { x: 385, y: yPos - 9 },
      end: { x: 388, y: yPos - 12 },
      thickness: 1.5,
      color: sigGreen
    });
    page.drawLine({
      start: { x: 388, y: yPos - 12 },
      end: { x: 393, y: yPos - 5 },
      thickness: 1.5,
      color: sigGreen
    });

    page.drawText("DIGITALLY SIGNED", { x: 398, y: yPos - 12, size: 8, font: helveticaBold, color: sigGreen });
    page.drawText("Signer: SatByte Technologies Pvt Ltd", { x: 385, y: yPos - 22, size: 6.5, font: helveticaBold, color: textDark });
    page.drawText("Authority: Verified SaaS Billing Node", { x: 385, y: yPos - 30, size: 6, font: helvetica, color: textMuted });
    page.drawText(`Date: ${invoiceDate}`, { x: 385, y: yPos - 38, size: 6, font: helvetica, color: textMuted });
    page.drawText(mockHash, { x: 385, y: yPos - 46, size: 5, font: helvetica, color: textMuted });

    // Bottom brand tag
    page.drawText("Thank you for your purchase & supporting student innovation! - SatByte Team", {
      x: 40,
      y: 40,
      size: 8,
      font: helveticaBold,
      color: primaryBlue
    });

    // Output raw buffer bytes
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw new Error("Failed to compile tax invoice PDF");
  }
};
