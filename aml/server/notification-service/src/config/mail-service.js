// emailService.js
const nodemailer = require('nodemailer');

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can also use other providers like Outlook, Yahoo, or custom SMTP
    auth: {
        user: process.env.EMAIL_USER, // Set these as environment variables for security
        pass: process.env.EMAIL_PASS
    }
});

// Function to send email
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
