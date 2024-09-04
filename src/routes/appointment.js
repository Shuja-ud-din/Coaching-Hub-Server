import express from "express";
import { authentication } from "../middlewares/authentication.js";

import bodyValidator from "../validation/bodyValidator.js";
import {
  appointmentSchema,
  cancelAppointmentSchema,
} from "../models/appointmentModel.js";
import { catchAsync } from "../utils/catchAsync.js";

const appointmentRoutes = express.Router();

appointmentRoutes.get("/", authentication, catchAsync(get));

// appointmentRoutes.get(
//   "/:id",
//   authentication,
//   catchAsync(appointmentService.getAppointmentById)
// );

// appointmentRoutes.post(
//   "/",
//   authentication,
//   bodyValidator(appointmentSchema),
//   catchAsync(appointmentService.addAppointment)
// );

// appointmentRoutes.put(
//   "/cancel/:id",
//   authentication,
//   bodyValidator(cancelAppointmentSchema),
//   catchAsync(appointmentService.cancelAppointment)
// );
// appointmentRoutes.patch(
//   "/checkIn/:id",
//   authentication,
//   catchAsync(appointmentService.checkInAppointment)
// );

export default appointmentRoutes;
