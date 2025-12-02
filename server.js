const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP connection error:', error);
  } else {
    console.log('Server is ready to send messages');
  }
});

// POST endpoint for contact form
app.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: firstName, lastName, email, and message are required',
      });
    }

    // Recipient emails
    const recipients = [
      'biz.dev@texpro-kgroup.com.tn',
      'slim.tounsi@texpro-kgroup.com.tn',
      'm.abidi.contact@gmail.com'
    ].join(', ');

    // Create HTML email template
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
          }
          .field {
            margin-bottom: 20px;
          }
          .field-label {
            font-weight: bold;
            color: #2c3e50;
            display: inline-block;
            min-width: 120px;
          }
          .field-value {
            color: #555;
          }
          .message-box {
            background-color: white;
            padding: 15px;
            border-left: 4px solid #2c3e50;
            margin-top: 10px;
            border-radius: 3px;
          }
          .footer {
            background-color: #ecf0f1;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #7f8c8d;
            border-radius: 0 0 5px 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>New Contact Form Submission</h2>
          <p style="margin: 0;">TEXPRO CORP Contact Form</p>
        </div>
        <div class="content">
          <div class="field">
            <span class="field-label">First Name:</span>
            <span class="field-value">${firstName}</span>
          </div>
          <div class="field">
            <span class="field-label">Last Name:</span>
            <span class="field-value">${lastName}</span>
          </div>
          <div class="field">
            <span class="field-label">Email:</span>
            <span class="field-value"><a href="mailto:${email}">${email}</a></span>
          </div>
          ${phone ? `
          <div class="field">
            <span class="field-label">Phone:</span>
            <span class="field-value"><a href="tel:${phone}">${phone}</a></span>
          </div>
          ` : ''}
          <div class="field">
            <span class="field-label">Message:</span>
            <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the TEXPRO CORP contact form.</p>
          <p>Submitted on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    // Create plain text version
    const textEmail = `
New Contact Form Submission - TEXPRO CORP

First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Message:
${message}

---
Submitted on ${new Date().toLocaleString()}
    `.trim();

    // Email options
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'TEXPRO CORP Contact Form'}" <${process.env.EMAIL_USER}>`,
      to: recipients,
      replyTo: email, // Allow replying directly to the sender
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: htmlEmail,
      text: textEmail,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Contact form email sent successfully:', info.messageId);

    res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    res.status(500).json({
      success: false,
      message: 'There was an error sending your message. Please try again later.',
      error: error.message,
    });
  }
});

// POST endpoint to receive data and send email
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    // Validate required fields
    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, and html are required',
      });
    }

    // Email options
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Express Server'}" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html, // HTML body
      text: text || html.replace(/<[^>]*>/g, ''), // Plain text fallback
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
});

// GET endpoint for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Express NodeMailer Server is running',
    endpoints: {
      'POST /contact': 'Submit contact form and send email',
      'POST /send-email': 'Send an HTML email',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

