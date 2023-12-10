const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHnadler");

exports.sendmail = (req, res, next, url) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    post: 465,
    auth: {
      user: process.env.MAIL_EMAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Shrawan Private Limited",
    to: req.body.email,
    subject: "Password Reset Link",
    // text:"do not share this link to anyone"
    html: `<h1>Click link to reset password</h1> <a href="${url}">Password reset link</a>`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return next(new ErrorHandler(err, 500));
    console.log(info);
    return res.status(200).json({
      message: "mail sent successfully",
      url,
    });
  });
};
