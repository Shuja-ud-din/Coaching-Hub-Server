import httpStatus from "http-status";
import { ApiError } from "../errors/ApiError.js";
import { uploadFile } from "../services/upload.service.js";
import { env } from "../config/env.js";

const uploadImage = async (req, res) => {
  const { file } = req;

  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file uploaded");
  }

  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please upload an image file");
  }

  const response = await uploadFile(file.path);

  console.log(response);

  res.status(httpStatus.OK).json({
    message: "File uploaded successfully",
    url: response.url,
  });
};

const uploadDocument = async (req, res) => {
  const file = req.file; // Use req.file if using multer

  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file uploaded");
  }

  // Validate file type
  if (!file.originalname.match(/\.(pdf|docx|doc|jpg|jpeg|png|gif)$/)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please upload a valid file (pdf, docx, doc, jpg, jpeg, png, gif)"
    );
  }

  // Perform upload operation
  try {
    const response = await uploadFile(file.path); // Use file.path if it's the correct path
    console.log(response);

    res.status(httpStatus.OK).json({
      message: "File uploaded successfully",
      url: `${env.BACKEND_URL}/documents/${file.filename}`, // Use file.filename for the URL
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "File upload failed");
  }
};

export { uploadImage, uploadDocument };
