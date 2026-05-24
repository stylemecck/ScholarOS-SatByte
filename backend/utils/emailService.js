const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendReferralBonusEmail = async (userEmail, userName, bonusAmount) => {
  if (!process.env.EMAIL_USER) return; // Skip if not configured

  try {
    await transporter.sendMail({
      from: `"Student Toolkit Pro" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🎉 You've earned Referral Credits!",
      html: `
        <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #8b5cf6;">Great news, ${userName}!</h2>
          <p>Someone just joined Student Toolkit Pro using your referral code.</p>
          <div style="background: #f5f3ff; padding: 20px; border-radius: 15px; text-align: center;">
            <h1 style="margin: 0; color: #8b5cf6;">+${bonusAmount} Credits</h1>
            <p style="margin: 5px 0 0; font-weight: bold; color: #6d28d9;">Added to your account</p>
          </div>
          <p style="margin-top: 20px;">Keep sharing your code to earn more free AI credits!</p>
          <div style="margin-top: 30px; border-top: 1px solid #eee; pt: 20px; font-size: 12px; color: #888;">
            © 2026 Student Toolkit Pro | SatByte Technologies
          </div>
        </div>
      `
    });
    console.log(`Referral email sent to ${userEmail}`);
  } catch (err) {
    console.error("Failed to send email:", err.message);
  }
};

/**
 * Send professional tax invoice to customer using Resend
 */
exports.sendInvoiceEmail = async (userEmail, userName, pdfBuffer, billingDetails) => {
  const { invoiceNo, planDetails, amount, phoneNumber } = billingDetails;

  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ [Resend Email Service] RESEND_API_KEY is not configured in .env. Skipping email sending, but tax invoice PDF was generated successfully.");
    console.log(`[Invoice Simulation] To: ${userEmail} (${userName}) | Invoice No: ${invoiceNo} | Plan: ${planDetails} | Phone: ${phoneNumber} | Amount: Rs. ${amount}`);
    return;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Student Toolkit Pro <onboarding@resend.dev>';
    
    const htmlContent = `
      <div style="font-family: 'Outfit', -apple-system, sans-serif; max-width: 650px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 24px; background: #fafafa; color: #1f2937;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #3b82f6; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.04em;">STUDENT TOOLKIT PRO</h2>
          <p style="margin: 5px 0 0; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; tracking: 0.15em;">Official Tax Invoice</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.6; color: #374151;">Hello <strong>${userName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Thank you for upgrading! Your transaction was completed successfully, and your account credits have been updated. We have generated an official, GST-compliant tax invoice for your purchase which is attached to this email as a PDF.</p>
        
        <div style="background: #ffffff; border: 1px solid #f3f4f6; border-radius: 16px; padding: 25px; margin: 25px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <h4 style="margin: 0 0 15px; color: #111827; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">Transaction Summary</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Invoice Number:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #111827;">${invoiceNo}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Plan Activated:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #3b82f6;">${planDetails}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Registered Mobile:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #111827;">${phoneNumber}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 700;">Grand Total Paid:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 800; color: #111827; font-size: 14px;">Rs. ${amount.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 13px; line-height: 1.6; color: #6b7280; font-style: italic; margin-bottom: 25px;">Note: Your subscription benefits and AI credits are now fully active inside your student dashboard.</p>
        
        <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 11px; color: #9ca3af; text-align: center; line-height: 1.5;">
          © 2026 Student Toolkit Pro | SatByte Technologies Private Limited<br>
          Sector 45, Gurgaon, Haryana, 122003
        </div>
      </div>
    `;

    console.log(`[Resend API] Requesting email delivery to ${userEmail} via Resend...`);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: userEmail,
        subject: `Tax Invoice ${invoiceNo} - Student Toolkit Pro`,
        html: htmlContent,
        attachments: [
          {
            filename: `Invoice_${invoiceNo}.pdf`,
            content: pdfBuffer.toString('base64')
          }
        ]
      })
    });

    const resData = await response.json();
    if (response.ok) {
      console.log(`[Resend Success] Tax Invoice email successfully sent via Resend. ID: ${resData.id}`);
    } else {
      console.error("[Resend Error Response]:", resData);
      throw new Error(resData.message || "Failed to deliver email via Resend");
    }
  } catch (err) {
    console.error("Failed to send Resend email:", err.message);
  }
};
