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
  markAppointmentAsConductedHandler,
} from "../controller/appointment.contoller.js";
import { todos, updateTodos } from "../models/todosModel.js";
import {
  addTodosHandler,
  completeTodoHandler,
  deleteTodosHandler,
  getAllTodosHandler,
  updateTodosHandler,
} from "../controller/todos.controller.js";

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

appointmentRoutes.post(
  "/:id/todos",
  bodyValidator(todos),
  catchAsync(addTodosHandler)
);

appointmentRoutes.get("/:id/todos", catchAsync(getAllTodosHandler));
appointmentRoutes.put(
  "/todos/:id",
  bodyValidator(updateTodos),
  catchAsync(updateTodosHandler)
);
appointmentRoutes.patch(
  "/todos/:id",
  catchAsync(completeTodoHandler)
);
appointmentRoutes.patch(
  "/:id",
  catchAsync(markAppointmentAsConductedHandler)
);
appointmentRoutes.delete("/todos/:id", catchAsync(deleteTodosHandler));
export default appointmentRoutes;
