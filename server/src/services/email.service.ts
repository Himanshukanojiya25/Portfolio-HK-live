import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({  // ✅ CORRECTION HERE: createTransport (not createTransporter)
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use App Password for Gmail
    },
  });
};

export const emailService = {
  // Send contact form notification
  sendContactNotification: async (contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ipAddress: string;
  }) => {
    try {
      const transporter = createTransporter();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
        subject: `New Portfolio Contact: ${contactData.subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #007bff; color: white; padding: 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #555; }
              .value { color: #333; }
              .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <span class="label">Name:</span>
                  <span class="value">${contactData.name}</span>
                </div>
                <div class="field">
                  <span class="label">Email:</span>
                  <span class="value">${contactData.email}</span>
                </div>
                <div class="field">
                  <span class="label">Subject:</span>
                  <span class="value">${contactData.subject}</span>
                </div>
                <div class="field">
                  <span class="label">Message:</span>
                  <div class="value" style="white-space: pre-wrap;">${contactData.message}</div>
                </div>
                <div class="field">
                  <span class="label">IP Address:</span>
                  <span class="value">${contactData.ipAddress}</span>
                </div>
                <div class="field">
                  <span class="label">Timestamp:</span>
                  <span class="value">${new Date().toLocaleString()}</span>
                </div>
              </div>
              <div class="footer">
                <p>This email was sent from your portfolio website contact form.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Contact notification email sent successfully');
      return result;
    } catch (error) {
      console.error('❌ Failed to send contact notification email:', error);
      throw error;
    }
  },

  // Send auto-reply to the person who contacted
  sendAutoReply: async (toEmail: string, name: string) => {
    try {
      const transporter = createTransporter();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Thank you for contacting me!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #28a745; color: white; padding: 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
              .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Reaching Out!</h1>
              </div>
              <div class="content">
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thank you for getting in touch with me through my portfolio website. I have received your message and will get back to you as soon as possible.</p>
                <p>I typically respond within 24-48 hours.</p>
                <p>Best regards,<br>Your Name</p>
              </div>
              <div class="footer">
                <p>This is an automated response. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Auto-reply email sent successfully');
      return result;
    } catch (error) {
      console.error('❌ Failed to send auto-reply email:', error);
      throw error;
    }
  },
};

export default emailService;