import express from "express";
import {
  adminAuthentication,
  authentication,
} from "../middlewares/authentication.js";
import bodyValidator from "../validation/bodyValidator.js";
import { registerExpoTokenBody } from "../models/expoTokenModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  registerExpoToken,
  testFirebaseNotification,
  unRegisterExpoToken,
} from "../controller/notification.controller.js";

const notificationsRoutes = express.Router();

// notificationsRoutes.get(
//   "/",
//   authentication,
//   catchAsync(notificationService.getNotifications)
// );

// notificationsRoutes.get(
//   "/admin/",
//   adminAuthentication,
//   catchAsync(notificationService.getAdminNotifications)
// );

// notificationsRoutes.patch(
//   "/read/:id",
//   authentication,
//   catchAsync(notificationService.markAsRead)
// );

// notificationsRoutes.patch(
//   "/readAll",
//   authentication,
//   catchAsync(notificationService.readAll)
// );

notificationsRoutes.post(
  "/expo/register",
  authentication,
  bodyValidator(registerExpoTokenBody),
  catchAsync(registerExpoToken)
);
notificationsRoutes.patch(
  "/expo/unregister",
  authentication,
  catchAsync(unRegisterExpoToken)
);

notificationsRoutes.post("/send", catchAsync(testFirebaseNotification));

export default notificationsRoutes;
