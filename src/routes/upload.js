import express from "express";
import { authentication } from "../middlewares/authentication.js";
import { documentUpload, imageUpload } from "../middlewares/multer.js";
import { catchAsync } from "../utils/catchAsync.js";
import { uploadDocument, uploadImage } from "../controller/upload.contoller.js";

const uploadRoutes = express.Router();

uploadRoutes.post(
  "/image",
  authentication,
  imageUpload.single("image"),
  catchAsync(uploadImage)
);

uploadRoutes.post(
  "/document",
  // authentication,
  documentUpload.single("document"),
  catchAsync(uploadDocument)
);

export { uploadRoutes };
