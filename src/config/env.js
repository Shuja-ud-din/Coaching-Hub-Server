import dotenv from "dotenv";

dotenv.config();

export const env = {
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 8000,
  BACKEND_URL: process.env.BACKEND_URL,

  // Mail
  MAIL: {
    MAIL_SENDER: process.env.MAIL_SENDER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
  },

  // Cloudinary
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
};

console.log(env);
