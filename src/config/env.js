import dotenv from "dotenv";

dotenv.config();

// export const env = {
//   MONGO_URL: process.env.MONGO_URL,
//   JWT_SECRET: process.env.JWT_SECRET,
//   PORT: process.env.PORT || 8000,
// };
export const env = {
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 8000,

  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  },
};
