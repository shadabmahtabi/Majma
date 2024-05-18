const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");
const otpModel = require("../routes/otpModel");

exports.sendmail = async (email, type, res, next) => {
  try {
    console.log(`Checking for existing OTP for email: ${email}, type: ${type}`);
    const existingOTP = await otpModel.findOne({ email, type }).exec();
    if (existingOTP) {
      console.log('existingOTP found:', existingOTP);
      return res.status(409).json({
        success: false,
        message: "OTP already sent for this email address and type.",
      });
    }

    console.log(`Creating new OTP for email: ${email}, type: ${type}`);
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.MAIL_EMAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let otp = Math.floor(1000 + Math.random() * 9000);
    const mailOptions = {
      from: "Majma Inc",
      to: email,
      subject: type === "forgetForm" ? "Reset Password" : "Delete Account",
      html: `<h1>Your verification code is ${otp}.</h1><h2>Do not share this with anyone!</h2>`,
    };

    let response = await new otpModel({
      email,
      otp,
      type,
    }).save();
    console.log('created otp:', response);

    const info = await transport.sendMail(mailOptions);
    console.log('Mail sent info:', info);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
    });
  } catch (error) {
    console.error('Error in sendmail:', error);
    return next(new ErrorHandler(`${error.message}`, 500));
  }
};