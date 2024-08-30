import { env } from "../config/env.js";

const sendMail = async (email, subject, text, callback) => {
  const mailOptions = {
    from: env.MAIL.MAIL_SENDER,
    to: email,
    subject,
    text,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.MAIL.MAIL_SENDER,
      pass: env.MAIL.MAIL_PASSWORD,
    },
  });
  console.log("function called");
  const response = transporter.sendMail(mailOptions, callback);
};

export default sendMail;
