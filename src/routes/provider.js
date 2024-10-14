import express from "express";
import { adminAuthentication } from "../middlewares/authentication.js";
import {
  addCertificateHandler,
  createProviderHandler,
  deleteCertificateHandler,
  getAllProvidersHandler,
  getProviderByIdHandler,
  updateCertificateHandler,
  updateProviderHandler,
} from "../controller/provider.controller.js";
import bodyValidator from "../validation/bodyValidator.js";
import { providerSchema } from "../models/providerModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { certificate, updateCertificate } from "../models/certificateModel.js";

const providerRoutes = express.Router();

providerRoutes.get(
  "/",
  // adminAuthentication,
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

providerRoutes.post(
  "/certificate/:providerId",
  bodyValidator(certificate),
  addCertificateHandler
);

providerRoutes.delete("/certificate/:certificateId", deleteCertificateHandler);

export { providerRoutes };
