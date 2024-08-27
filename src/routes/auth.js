import express from "express";
import bodyValidator from "../validation/bodyValidator.js";
import { userSchema } from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
const authRouter = express.Router();

authRouter.post("/register", bodyValidator(userSchema), catchAsync());

export { authRouter };
