import express from "express";
import { adminAuthentication } from "../middlewares/authentication.js";
import { getAllAdminsHandler } from "../controller/admin.controller.js";
import { catchAsync } from "../utils/catchAsync.js";

const adminRoutes = express.Router();

adminRoutes.get("/", adminAuthentication, catchAsync(getAllAdminsHandler));

export { adminRoutes };
