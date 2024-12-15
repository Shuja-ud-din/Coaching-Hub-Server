import express from "express";
import {
  adminAuthentication,
  authentication,
} from "../middlewares/authentication.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  addCustomerHandler,
  addFavoriteHandler,
  getAllCustomersHandler,
  getCustomerByIdHandler,
  getFavoritesHandler,
  removeFovoriteHandler,
  updateCustomerHandler,
} from "../controller/customer.controller.js";
import bodyValidator from "../validation/bodyValidator.js";
import {
  customerSchema,
  customerUpdateSchema,
} from "../models/customerModel.js";
import { addSelfTodo, updateSelfTodos } from "../models/selfTodos.js";
import {
  addSelfTodosHandler,
  completeSelfTodoHandler,
  deleteSelfTodosHandler,
  getAllSelfTodosHandler,
  updateSelfTodosHandler,
} from "../controller/selfTodos.controller.js";

const customerRoutes = express.Router();

customerRoutes.post(
  "/",
  authentication,
  bodyValidator(customerSchema),
  catchAsync(addCustomerHandler)
);

customerRoutes.put(
  "/:id",
  adminAuthentication,
  bodyValidator(customerUpdateSchema),
  catchAsync(updateCustomerHandler)
);

customerRoutes.get(
  "/:id",
  adminAuthentication,
  catchAsync(getCustomerByIdHandler)
);
customerRoutes.patch(
  "/addFavorite/:id",
  authentication,
  catchAsync(addFavoriteHandler)
);
customerRoutes.patch(
  "/removeFavorite/:id",
  authentication,
  catchAsync(removeFovoriteHandler)
);
customerRoutes.get(
  "/favorites/all",
  authentication,
  catchAsync(getFavoritesHandler)
);
customerRoutes.get(
  "/",
  adminAuthentication,
  catchAsync(getAllCustomersHandler)
);

customerRoutes.post(
  "/:id/todos",
  bodyValidator(addSelfTodo),
  catchAsync(addSelfTodosHandler)
);

customerRoutes.get("/:id/todos", catchAsync(getAllSelfTodosHandler));
customerRoutes.put(
  "/todos/:id",
  bodyValidator(updateSelfTodos),
  catchAsync(updateSelfTodosHandler)
);
customerRoutes.patch("/todos/:id", catchAsync(completeSelfTodoHandler));
customerRoutes.delete("/todos/:id", catchAsync(deleteSelfTodosHandler));

export default customerRoutes;
