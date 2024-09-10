import express from "express";
import {
  adminAuthentication,
  authentication,
} from "../middlewares/authentication.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  addCustomerHandler,
  getAllCustomersHandler,
  getCustomerByIdHandler,
  updateCustomerHandler,
} from "../controller/customer.controller.js";
import bodyValidator from "../validation/bodyValidator.js";
import {
  customerSchema,
  customerUpdateSchema,
} from "../models/customerModel.js";

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

customerRoutes.get(
  "/",
  adminAuthentication,
  catchAsync(getAllCustomersHandler)
);

export default customerRoutes;
