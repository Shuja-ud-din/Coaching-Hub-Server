import express from "express";
import { adminAuthentication } from "../middlewares/authentication.js";
import {
  addAdminHandler,
  getAdminDashboardHandler,
  getAdminHandler,
  getAllAdminsHandler,
  toggleAdminStatusHandler,
  updateAdminHandler,
} from "../controller/admin.controller.js";
import { catchAsync } from "../utils/catchAsync.js";
import { adminSchema, updateAdminSchema } from "../models/adminModel.js";
import { toggleValidityBody } from "../models/userModel.js";
import { updateAdmin } from "../services/admin.service.js";
import bodyValidator from "../validation/bodyValidator.js";

const adminRoutes = express.Router();
adminRoutes.post(
  "/",
  adminAuthentication,
  bodyValidator(adminSchema),
  catchAsync(addAdminHandler)
);
adminRoutes.get("/", adminAuthentication, catchAsync(getAllAdminsHandler));

adminRoutes.put(
  "/:id",
  adminAuthentication,
  bodyValidator(updateAdminSchema),
  catchAsync(updateAdminHandler)
);

adminRoutes.patch(
  "/:id",
  adminAuthentication,
  bodyValidator(toggleValidityBody),
  catchAsync(toggleAdminStatusHandler)
);

adminRoutes.get("/:id", adminAuthentication, catchAsync(getAdminHandler));

adminRoutes.get(
  "/dashboard/details",
  adminAuthentication,
  catchAsync(getAdminDashboardHandler)
);

adminRoutes.get("/", adminAuthentication, catchAsync(getAllAdminsHandler));

export { adminRoutes };
