// emailService.js
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "dc6b52205ab3bf",
      pass: "81bb2d29ce6d0e"
    }
  });

// Function to send email
const sendEmail = async (to, subject, html) => { 
    try {
        await transporter.sendMail({
            from: '"Library" <library@example.com>',
            to: to,
            subject: subject,
            html: html 
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
