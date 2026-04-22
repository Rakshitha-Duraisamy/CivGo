const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, text) => {
  try {
    // This is a mock implementation. In a real scenario, use real SMTP credentials.
    console.log(`\n=== EMAIL NOTIFICATION ===`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: \n${text}`);
    console.log(`==========================\n`);
    
    // Uncomment to use real Nodemailer:
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: '"CivGo System" <noreply@civgo.local>',
      to,
      subject,
      text,
    });
    */
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
