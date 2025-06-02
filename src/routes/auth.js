import express from "express";
import bodyValidator from "../validation/bodyValidator.js";
import {
  generateOTPBody,
  loginSchema,
  userSchema,
  verifyUserBody,
} from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  createNewUserHandler,
  forgetPasswordHandler,
  generateOTPHandler,
  loginUserHandler,
  resetPasswordHandler,
  userVerificationHandler,
  verifyForgetPasswordOTPHandler,
} from "../controller/user.controller.js";
import {
  forgetPasswordBody,
  resetPasswordBody,
  verifyForgetPasswordOTPBody,
} from "../models/CPToken.js";
import { providerSchema } from "../models/providerModel.js";
import { providerSignupHandler } from "../controller/provider.controller.js";
import languageMiddleware from "../middlewares/language.js";

const authRoutes = express.Router();

authRoutes.post(
  "/register",
  bodyValidator(userSchema),
  languageMiddleware,
  catchAsync(createNewUserHandler)
);

authRoutes.post(
  "/provider/register",
  bodyValidator(providerSchema),
  catchAsync(providerSignupHandler)
);
authRoutes.post(
  "/login",
  bodyValidator(loginSchema),
  languageMiddleware,
  catchAsync(loginUserHandler)
);
authRoutes.post(
  "/verify",
  bodyValidator(verifyUserBody),
  languageMiddleware,
  catchAsync(userVerificationHandler)
);
authRoutes.post(
  "/generateOTP",
  bodyValidator(generateOTPBody),
  languageMiddleware,
  catchAsync(generateOTPHandler)
);
authRoutes.post(
  "/forgetPassword",
  bodyValidator(forgetPasswordBody),
  languageMiddleware,
  catchAsync(forgetPasswordHandler)
);
authRoutes.post(
  "/forgetPassword/verifyOTP",
  bodyValidator(verifyForgetPasswordOTPBody),
  languageMiddleware,
  catchAsync(verifyForgetPasswordOTPHandler)
);
authRoutes.post(
  "/resetPassword",
  bodyValidator(resetPasswordBody),
  languageMiddleware,
  catchAsync(resetPasswordHandler)
);

export { authRoutes };
