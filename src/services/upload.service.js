import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { env } from "../config/env.js";
import { ApiError } from "../errors/ApiError.js";

const { CLOUDINARY } = env;

const uploadFile = async (filePath) => {
  cloudinary.config({
    cloud_name: CLOUDINARY.CLOUD_NAME,
    api_key: CLOUDINARY.API_KEY,
    api_secret: CLOUDINARY.API_SECRET,
  });
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    fs.unlinkSync(filePath);
    throw new ApiError(500, error.message);
  }
};

export { uploadFile };
