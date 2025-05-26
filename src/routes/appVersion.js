import express from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { getVersion } from "../controller/appStatus.controller.js";

const appVersionRoutes = express.Router();

appVersionRoutes.get("/check", catchAsync(getVersion));

export default appVersionRoutes;
