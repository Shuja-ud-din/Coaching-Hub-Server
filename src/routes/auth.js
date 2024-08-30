import express from "express";
import bodyValidator from "../validation/bodyValidator.js";
import { loginSchema, userSchema } from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  createNewUser,
  loginPreviousUser,
} from "../controller/user.controller.js";
const authRouter = express.Router();

authRouter.post(
  "/register",
  bodyValidator(userSchema),
  catchAsync(createNewUser)
);
authRouter.post(
  "/login",
  bodyValidator(loginSchema),
  catchAsync(loginPreviousUser)
);
export { authRouter };
