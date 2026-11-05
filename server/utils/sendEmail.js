import nodemailer from 'nodemailer';

/**
 * Sends a real OTP email using Nodemailer
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} purpose - 'register' or 'login'
 */
export const sendOtpEmail = async (toEmail, otp, purpose = 'register') => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailService = process.env.EMAIL_SERVICE || 'gmail';

  if (!emailUser || !emailPass) {
    const errorMsg = 'Email credentials (EMAIL_USER & EMAIL_PASS) not configured in server/.env. Please configure your Gmail App Password.';
    console.error(`[EMAIL ERROR] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const subject =
    purpose === 'login'
      ? `[Campus Lost & Found] Your Login OTP: ${otp}`
      : `[Campus Lost & Found] Verify Your Registration: ${otp}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { text-align: center; margin-bottom: 24px; }
        .logo-badge { display: inline-block; background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 18px; padding: 8px 16px; border-radius: 8px; }
        .title { font-size: 22px; font-weight: 700; color: #0f172a; margin: 16px 0 8px; }
        .subtitle { font-size: 14px; color: #64748b; line-height: 1.5; }
        .otp-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 20px; text-align: center; margin: 28px 0; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; font-family: monospace; }
        .notice { font-size: 13px; color: #64748b; text-align: center; }
        .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo-badge">🔍 Campus Lost & Found</div>
          <h1 class="title">${purpose === 'login' ? 'Your Login Security Code' : 'Verify Your Email'}</h1>
          <p class="subtitle">Use the verification code below to complete your ${purpose === 'login' ? 'sign in' : 'account registration'}.</p>
        </div>

        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">Code expires in 10 minutes</p>
        </div>

        <p class="notice">If you did not request this verification code, please ignore this email. Do not share this code with anyone.</p>

        <div class="footer">
          Campus Lost & Found Platform • Automated Notification System
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Campus Lost & Found" <${emailUser}>`,
    to: toEmail,
    subject,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[EMAIL SUCCESS] OTP email sent to ${toEmail}. MessageId: ${info.messageId}`);
  return info;
};

