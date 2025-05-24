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

const authRoutes = express.Router();

authRoutes.post(
  "/register",
  bodyValidator(userSchema),
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
  catchAsync(loginUserHandler)
);
authRoutes.post(
  "/verify",
  bodyValidator(verifyUserBody),
  catchAsync(userVerificationHandler)
);
authRoutes.post(
  "/generateOTP",
  bodyValidator(generateOTPBody),
  catchAsync(generateOTPHandler)
);
authRoutes.post(
  "/forgetPassword",
  bodyValidator(forgetPasswordBody),
  catchAsync(forgetPasswordHandler)
);
authRoutes.post(
  "/forgetPassword/verifyOTP",
  bodyValidator(verifyForgetPasswordOTPBody),
  catchAsync(verifyForgetPasswordOTPHandler)
);
authRoutes.post(
  "/resetPassword",
  bodyValidator(resetPasswordBody),
  catchAsync(resetPasswordHandler)
);

export { authRoutes };
