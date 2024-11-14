
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'akshayabalu6@gmail.com', 
    pass: 'fame ydhi cpwv iiur',    
  },
});

// Function to send an email with an OTP
function sendOtpEmail(toEmail, otp) {
  const mailOptions = {
    from: 'akshayabalu6@gmail.com', // Replace with your actual email
    to: toEmail,
    subject: 'Password Reset OTP',
    text: `Your OTP to reset the password is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendOtpEmail,
};
