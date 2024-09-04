import express from "express";
import { adminAuthentication } from "../middlewares/authentication.js";
import {
  createProviderHandler,
  getAllProvidersHandler,
  getProviderByIdHandler,
  updateProviderHandler,
} from "../controller/provider.controller.js";
import bodyValidator from "../validation/bodyValidator.js";
import { providerSchema } from "../models/providerModel.js";
import { catchAsync } from "../utils/catchAsync.js";

const providerRoutes = express.Router();

providerRoutes.get(
  "/",
  adminAuthentication,
  catchAsync(getAllProvidersHandler)
);

providerRoutes.post(
  "/",
  adminAuthentication,
  bodyValidator(providerSchema),
  catchAsync(createProviderHandler)
);

providerRoutes.get(
  "/:id",
  adminAuthentication,
  catchAsync(getProviderByIdHandler)
);

providerRoutes.put(
  "/:id",
  adminAuthentication,
  catchAsync(updateProviderHandler)
);

export { providerRoutes };
