import httpStatus from "http-status";
import { ApiError } from "../errors/ApiError.js";
import { uploadFile } from "../services/upload.service.js";

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
  const { file } = req;

  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file uploaded");
  }

  // pdf or docx or doc
  if (!file.originalname.match(/\.(pdf|docx|doc)$/)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please upload a document file (pdf, docx, doc)"
    );
  }

  const response = await uploadFile(file.path);

  console.log(response);

  res.status(httpStatus.OK).json({
    message: "File uploaded successfully",
    url: response.url,
  });
};

export { uploadImage, uploadDocument };
