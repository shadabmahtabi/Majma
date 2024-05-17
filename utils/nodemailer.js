const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");
const otpModel = require("../routes/otpModel");

exports.sendmail = async (email, req, res, next) => {
  try {
    const existingOTP = await otpModel.findOne({ email, type: req.params.type });
    if (existingOTP)
      return res
        .status(400)
        .json({
          success: false,
          message: "OTP already sent for this email address.",
        });

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
      subject: "Reset Password",
      html: `<h1>Your verification code is ${otp}.</h1><h2>Do not share this with anyone!</h2>`,
    };

    const info = await transport.sendMail(mailOptions);
    let response = await new otpModel({ email, otp, type: req.params.type }).save();

    return res
      .status(200)
      .json({
        success: true,
        message: "OTP sent successfully!",
        id: response._id,
        info,
      });
  } catch (error) {
    return next(new ErrorHandler(`${error.message}`, 500));
  }
};
