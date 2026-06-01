import nodemailer from 'nodemailer';

let transporter;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    console.log('No SMTP config found in environment. Creating an Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return transporter;
};

export const sendVerificationEmail = async (email, token, fullName) => {
  try {
    const tx = await getTransporter();
    
    // Front-end URL where Next.js runs (default port 3000)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

    const mailOptions = {
      from: '"EmergencyCare 360" <noreply@emergencycare360.com>',
      to: email,
      subject: 'Verify Your Email Address - EmergencyCare 360',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #c22929; text-align: center;">EmergencyCare 360</h2>
          <hr style="border: 0; border-top: 1px solid #e0e0e0;" />
          <p>Hello ${fullName},</p>
          <p>Thank you for signing up with EmergencyCare 360. Please verify your email address to activate your account and get full access to our emergency support systems.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #c22929; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify My Account</a>
          </div>
          <p>If the button above does not work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #555;"><a href="${verifyUrl}">${verifyUrl}</a></p>
          <p>This verification link will expire in 24 hours.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-top: 30px;" />
          <p style="font-size: 12px; color: #888; text-align: center;">EmergencyCare 360 &copy; 2026. All rights reserved.</p>
        </div>
      `,
    };

    const info = await tx.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`\n--------------------------------------------`);
      console.log(`✉️  Ethereal Email Preview URL: ${previewUrl}`);
      console.log(`--------------------------------------------\n`);
    }
    
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};
