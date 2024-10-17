import express from "express";
import { adminAuthentication, authentication } from "../middlewares/authentication.js";
import {
  addCertificateHandler,
  addReviewHandler,
  createProviderHandler,
  deleteCertificateHandler,
  getAllProvidersHandler,
  getProviderByIdHandler,
  getProviderReviewsHandler,
  updateCertificateHandler,
  updateProviderHandler,
} from "../controller/provider.controller.js";
import bodyValidator from "../validation/bodyValidator.js";
import { addReviewBody, providerSchema } from "../models/providerModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { certificate, updateCertificate } from "../models/certificateModel.js";

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
providerRoutes.post(
  "/addReview/:id",
  authentication,
  
  bodyValidator(addReviewBody),
  catchAsync(addReviewHandler)
);
providerRoutes.get(
  "/reviews/:id",
  authentication,
  catchAsync(getProviderReviewsHandler)
);
providerRoutes.post(
  "/certificate/:providerId",
  bodyValidator(certificate),
  addCertificateHandler
);

providerRoutes.delete("/certificate/:certificateId", deleteCertificateHandler);

export { providerRoutes };
