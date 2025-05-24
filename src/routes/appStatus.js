import express from "express";
import {
  checkStatus,
  getVersion,
  toggleStatus,
} from "../controller/appStatus.controller.js";
import { catchAsync } from "../utils/catchAsync.js";

const appStatusRoutes = express.Router();

appStatusRoutes.put("/toggle-status", catchAsync(toggleStatus));

appStatusRoutes.get("/status", catchAsync(checkStatus));

appStatusRoutes.get("/version", catchAsync(getVersion));

export default appStatusRoutes;
