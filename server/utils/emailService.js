const nodemailer = require('nodemailer');
require('dotenv').config();

// Check if environment variables are loaded
console.log('📬 Email Config:', {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? '****' : 'missing'
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true // Debug mode ON
});

// Test SMTP connection
transporter.verify(function(error, success) {
    if (error) {
        console.log('❌ SMTP connection error:', error);
    } else {
        console.log('✅ SMTP server is ready to send emails');
    }
});

const sendVerificationEmail = async (email, verificationCode) => {
    try {
        console.log('📨 Attempting to send email to:', email);
        const mailOptions = {
            from: `"E-Vault" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'E-Vault - Email Verification',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Welcome to E-Vault!</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #4CAF50; letter-spacing: 5px; text-align: center;">${verificationCode}</h1>
                    <p>This code will expire in 24 hours.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Detailed email sending error:', error);
        throw error;
    }
};

module.exports = { sendVerificationEmail };
