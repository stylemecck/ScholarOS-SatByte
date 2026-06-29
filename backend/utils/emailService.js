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
      from: '"ScholarOS - SatByte" <${process.env.EMAIL_USER}>',
      to: userEmail,
      subject: "🎉 You've earned Referral Credits!",
      html: `
        <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #8b5cf6;">Great news, ${userName}!</h2>
          <p>Someone just joined ScholarOS using your referral code.</p>
          <div style="background: #f5f3ff; padding: 20px; border-radius: 15px; text-align: center;">
            <h1 style="margin: 0; color: #8b5cf6;">+${bonusAmount} Credits</h1>
            <p style="margin: 5px 0 0; font-weight: bold; color: #6d28d9;">Added to your account</p>
          </div>
          <p style="margin-top: 20px;">Keep sharing your code to earn more free AI credits!</p>
          <div style="margin-top: 30px; border-top: 1px solid #eee; pt: 20px; font-size: 12px; color: #888;">
            © 2026 ScholarOS | SatByte Technologies
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
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'ScholarOS - SatByte <onboarding@resend.dev>';
    
    const htmlContent = `
      <div style="font-family: 'Outfit', -apple-system, sans-serif; max-width: 650px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 24px; background: #fafafa; color: #1f2937;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #3b82f6; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.04em;">SCHOLAROS</h2>
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
        
        <p style="font-size: 13px; line-height: 1.6; color: #6b7280; font-style: italic; margin-bottom: 25px;">Note: Your subscription benefits and AI credits are now fully active inside your dashboard.</p>
        
        <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 11px; color: #9ca3af; text-align: center; line-height: 1.5;">
          © 2026 ScholarOS | SatByte Technologies Private Limited<br>
          Ward No. 07, Sarmastpur Jhitkahi (Shamil), Vaishali, Bihar - 844122
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
        subject: `Tax Invoice ${invoiceNo} - ScholarOS`,
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

/**
 * Send email notification to credit recipient
 */
exports.sendGiftCreditEmail = async (recipientEmail, recipientName, senderName, senderEmail, giftDetails) => {
  const { giftAmount, systemFee, netTransferred } = giftDetails;

  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ [Resend Email Service] RESEND_API_KEY is not configured in .env. Skipping recipient credit email.");
    console.log(`[Credit Simulation] To: ${recipientEmail} (${recipientName}) | Sender: ${senderName} (${senderEmail}) | Gifted: ${giftAmount} | Net: ${netTransferred}`);
    return;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'ScholarOS - SatByte <onboarding@resend.dev>';
    
    const htmlContent = `
      <div style="font-family: 'Outfit', -apple-system, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 24px; background: #fafafa; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #8b5cf6; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.04em;">SCHOLAROS</h2>
          <p style="margin: 5px 0 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;">Credits Received Notification</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Great news, <strong>${recipientName}</strong>!</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">You have just received AI credits gifted to your account by <strong>${senderName}</strong> (${senderEmail}).</p>
        
        <div style="background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 16px; padding: 25px; margin: 25px 0; text-align: center; box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.05);">
          <h1 style="margin: 0; color: #7c3aed; font-size: 36px; font-weight: 900; letter-spacing: -0.04em;">+${netTransferred} Credits</h1>
          <p style="margin: 5px 0 0; font-weight: bold; color: #6d28d9; font-size: 13px;">Added to your Balance</p>
        </div>

        <div style="background: #ffffff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px; margin: 25px 0; font-size: 13px;">
          <h4 style="margin: 0 0 12px; color: #1e293b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">Transfer Details</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #475569;">
            <tr>
              <td style="padding: 5px 0;">Total Gifted by Sender:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 600; color: #1e293b;">${giftAmount} Credits</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">System Gifting Fee (1.5%):</td>
              <td style="padding: 5px 0; text-align: right; color: #b91c1c;">-${systemFee} Credits</td>
            </tr>
            <tr style="border-top: 1px solid #f1f5f9; font-weight: 700;">
              <td style="padding: 8px 0; color: #1e293b;">Net Credits Credited:</td>
              <td style="padding: 8px 0; text-align: right; color: #7c3aed; font-size: 14px;">+${netTransferred} Credits</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 13px; line-height: 1.6; color: #64748b; font-style: italic; margin-bottom: 25px;">These credits are ready to use for Resume Parsing, AI Predictions, study planners, and all AI features inside your ScholarOS dashboard.</p>
        
        <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; text-align: center;">
          © 2026 ScholarOS | SatByte Technologies Private Limited<br>
          Ward No. 07, Sarmastpur Jhitkahi (Shamil), Vaishali, Bihar - 844122
        </div>
      </div>
    `;

    console.log(`[Resend API] Sending recipient credit notification to ${recipientEmail}...`);
    
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipientEmail,
        subject: `🎉 You've received +${netTransferred} Credits! - ScholarOS`,
        html: htmlContent
      })
    });
  } catch (err) {
    console.error("Failed to send Resend credit email:", err.message);
  }
};

/**
 * Send email notification to credit sender
 */
exports.sendGiftDebitEmail = async (senderEmail, senderName, recipientName, recipientEmail, giftDetails) => {
  const { giftAmount, systemFee, netTransferred } = giftDetails;

  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ [Resend Email Service] RESEND_API_KEY is not configured in .env. Skipping sender debit email.");
    console.log(`[Debit Simulation] To: ${senderEmail} (${senderName}) | Recipient: ${recipientName} (${recipientEmail}) | Total Debited: ${giftAmount}`);
    return;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'ScholarOS - SatByte <onboarding@resend.dev>';
    
    const htmlContent = `
      <div style="font-family: 'Outfit', -apple-system, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 24px; background: #fafafa; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #64748b; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.04em;">SCHOLAROS</h2>
          <p style="margin: 5px 0 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;">Credits Transferred Notification</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Hello <strong>${senderName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">Your transfer request was successfully processed! We have debited the requested credits from your account balance and credited them to the recipient.</p>
        
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 16px; padding: 25px; margin: 25px 0; text-align: center;">
          <h1 style="margin: 0; color: #475569; font-size: 36px; font-weight: 900; letter-spacing: -0.04em;">-${giftAmount} Credits</h1>
          <p style="margin: 5px 0 0; font-weight: bold; color: #64748b; font-size: 13px;">Debited from your Balance</p>
        </div>

        <div style="background: #ffffff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px; margin: 25px 0; font-size: 13px;">
          <h4 style="margin: 0 0 12px; color: #1e293b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">Transfer Receipt</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #475569;">
            <tr>
              <td style="padding: 5px 0;">Recipient Student:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 600; color: #1e293b;">${recipientName} (${recipientEmail})</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">Transfer Amount:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 600; color: #1e293b;">${giftAmount} Credits</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">System Gifting Fee (1.5%):</td>
              <td style="padding: 5px 0; text-align: right; color: #b91c1c;">${systemFee} Credits</td>
            </tr>
            <tr style="border-top: 1px solid #f1f5f9; font-weight: 700;">
              <td style="padding: 8px 0; color: #1e293b;">Recipient Received:</td>
              <td style="padding: 8px 0; text-align: right; color: #0284c7;">${netTransferred} Credits</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 13px; line-height: 1.6; color: #64748b; font-style: italic; margin-bottom: 25px;">Thank you for sharing your credits and supporting fellow students within the ScholarOS community!</p>
        
        <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; text-align: center;">
          © 2026 ScholarOS | SatByte Technologies Private Limited<br>
          Ward No. 07, Sarmastpur Jhitkahi (Shamil), Vaishali, Bihar - 844122
        </div>
      </div>
    `;

    console.log(`[Resend API] Sending sender debit notification to ${senderEmail}...`);
    
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: senderEmail,
        subject: `💸 Credit Gifting Receipt - ScholarOS`,
        html: htmlContent
      })
    });
  } catch (err) {
    console.error("Failed to send Resend debit email:", err.message);
  }
};

/**
 * Send professional OTP email to user using Resend
 */
exports.sendOTPEmail = async (userEmail, userName, otpCode) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ [Resend Email Service] RESEND_API_KEY is not configured in .env. Skipping OTP email delivery.");
    console.log(`[OTP Simulation] To: ${userEmail} (${userName}) | OTP Code: ${otpCode} (Valid for 10 minutes)`);
    return;
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'ScholarOS - SatByte <onboarding@resend.dev>';
    
    const htmlContent = `
      <div style="font-family: 'Outfit', -apple-system, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 24px; background: #fafafa; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #3b82f6; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.04em;">SCHOLAROS</h2>
          <p style="margin: 5px 0 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;">Secure Verification Request</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Hello <strong>${userName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">We received a request to reset the password for your ScholarOS account. Use the secure One-Time Password (OTP) below to complete your reset request:</p>
        
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 16px; padding: 25px; margin: 25px 0; text-align: center; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.05);">
          <h1 style="margin: 0; color: #1d4ed8; font-size: 42px; font-weight: 900; letter-spacing: 0.25em; padding-left: 0.25em;">${otpCode}</h1>
          <p style="margin: 8px 0 0; font-weight: bold; color: #2563eb; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Valid for 10 minutes only</p>
        </div>
        
        <p style="font-size: 13px; line-height: 1.6; color: #64748b;">If you did not request this password reset, please ignore this email or contact support. Your password will remain secure and unchanged.</p>
        
        <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; text-align: center;">
          © 2026 ScholarOS | SatByte Technologies Private Limited<br>
          Ward No. 07, Sarmastpur Jhitkahi (Shamil), Vaishali, Bihar - 844122
        </div>
      </div>
    `;

    console.log(`[Resend API] Delivering OTP email notification to ${userEmail} via Resend...`);
    
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: userEmail,
        subject: `🔑 ${otpCode} is your Password Reset Code - ScholarOS`,
        html: htmlContent
      })
    });
  } catch (err) {
    console.error("Failed to send Resend OTP email:", err.message);
  }
};
