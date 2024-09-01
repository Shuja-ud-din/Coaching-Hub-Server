import dotenv from "dotenv";

dotenv.config();

export const env = {
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 8000,
  MAIL: {
    MAIL_SENDER: process.env.MAIL_SENDER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  },
};

console.log(env);
