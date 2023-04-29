const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER || "your email",
    pass: process.env.NODEMAILER_PASS || "your password",
  },
});

const OTP = Math.floor(100000 + Math.random() * 900000);

module.exports = {
  OTP,
  transporter,
};
