require("dotenv").config();
console.log(process.env.EMAIL_PORT);
var nodemailer = require("nodemailer");

module.exports = {
  sendEmail: async function (from, to, subject, text, attachments) {
    console.log(process.env.EMAIL_USER)
    var transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    var mailOptions = {
      from,
      to,
      subject,
      text,
      attachments,
    };
    let promise = new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (e, info) {
        if (e) {
          reject(e);
        }
        resolve(info);
      });
    });
    return promise;
  },
};
