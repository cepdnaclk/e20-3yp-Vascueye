require("dotenv").config();
const nodemailer = require("nodemailer");

// Configure Nodemailer with Outlook SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com", // Outlook SMTP server
  port: 587, // Use port 587 for TLS
  secure: false, // false for TLS (true for SSL which uses port 465)
  auth: {
    user: process.env.OUTLOOK_EMAIL, // Your Outlook email
    pass: process.env.OUTLOOK_PASSWORD, // Your Outlook password
  },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.OUTLOOK_EMAIL, // Your Outlook email
      to, // Recipient email
      subject, // Email subject
      text, // Email body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, message: "Email sending failed", error };
  }
};

// Export function for use in routes
module.exports = { sendEmail };
