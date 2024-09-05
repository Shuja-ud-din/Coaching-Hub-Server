import express from "express";
import { authentication } from "../middlewares/authentication.js";

import bodyValidator from "../validation/bodyValidator.js";
import {
  appointmentSchema,
  cancelAppointmentSchema,
} from "../models/appointmentModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  addAppointmentHandler,
  getAllAppointmentsHandler,
  getAppointmentByIdHandler,
} from "../controller/appointment.contoller.js";

const appointmentRoutes = express.Router();

appointmentRoutes.get(
  "/",
  authentication,
  catchAsync(getAllAppointmentsHandler)
);

appointmentRoutes.get(
  "/:id",
  authentication,
  catchAsync(getAppointmentByIdHandler)
);

appointmentRoutes.post(
  "/",
  authentication,
  bodyValidator(appointmentSchema),
  catchAsync(addAppointmentHandler)
);

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
