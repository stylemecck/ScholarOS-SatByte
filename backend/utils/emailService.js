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
