import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const sendMail = async ({ to, subject, text, html }, callback) => {
  const mailOptions = {
    from: env.MAIL.MAIL_SENDER,
    to,
    subject,
    text,
    html,
  };

  const transporter = nodemailer.createTransport({
    host: env.MAIL.MAIL_HOST,
    port: env.MAIL.MAIL_PORT,
    secure: true,

    auth: {
      user: env.MAIL.MAIL_SENDER,
      pass: env.MAIL.MAIL_PASSWORD,
    },
  });
  console.log("function called");
  const response = transporter.sendMail(mailOptions, callback);
};

export default sendMail;
