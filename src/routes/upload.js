import express from "express";
import { authentication } from "../middlewares/authentication.js";
import { fileUpload } from "../middlewares/multer.js";
import { catchAsync } from "../utils/catchAsync.js";
import { uploadDocument, uploadImage } from "../controller/upload.contoller.js";

const uploadRoutes = express.Router();

uploadRoutes.post(
  "/image",
  authentication,
  fileUpload.single("image"),
  catchAsync(uploadImage)
);

uploadRoutes.post(
  "/document",
  authentication,
  fileUpload.single("document"),
  catchAsync(uploadDocument)
);

export { uploadRoutes };
