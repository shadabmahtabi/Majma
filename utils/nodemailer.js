const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");
const otpModel = require("../routes/otpModel");

exports.sendmail = (email, res, next) => {
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
    from: process.env.MAIL_EMAIL_ADDRESS,
    to: email,
    subject: "Reset Password",
    html: `<h1>Your verification code is ${otp}.</h1>
      <h2>Do not share this with anyone!</h2>
      `,
  };
  
  transport.sendMail(mailOptions, async (err, info) => {
    try {
      if (err) throw new Error(err.message);

      let response = await new otpModel({
        email: email,
        otp: otp,
      }).save();

      return res.status(250).json({
        success: true,
        message: "OTP sent successfully!",
        id: response._id,
        info: info,
      });
    } catch (error) {
      return next(new ErrorHandler(`${error.message}`, 500));
    }
  });
};
