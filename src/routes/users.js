import express from "express";
import { authentication } from "../middlewares/authentication.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  updateLanguageHandler,
  updateTimezoneHandler,
} from "../controller/user.controller.js";
import { updateLanguageBody, updateTimezoneBody } from "../models/userModel.js";
import bodyValidator from "../validation/bodyValidator.js";

const userRoutes = express.Router();

userRoutes.patch(
  "/language",
  authentication,
  bodyValidator(updateLanguageBody),
  catchAsync(updateLanguageHandler)
);

userRoutes.patch(
  "/timezone",
  authentication,
  bodyValidator(updateTimezoneBody),
  catchAsync(updateTimezoneHandler)
);

export { userRoutes };
