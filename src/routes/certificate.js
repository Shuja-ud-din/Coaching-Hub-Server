import express from "express";
import bodyValidator from "../validation/bodyValidator.js";
import { certificate, updateCertificate } from "../models/certificateModel.js";
import {
  addCertificateHandler,
  deleteCertificateHandler,
  getCertificatesHandler,
  updateCertificateHandler,
} from "../controller/certificate.controller.js";

const certificateRoutes = express.Router();

certificateRoutes.post(
  "/:providerId",
  bodyValidator(certificate),
  addCertificateHandler
);
certificateRoutes.put(
  "/:certificateId",
  bodyValidator(updateCertificate),
  updateCertificateHandler
);
certificateRoutes.get("/:providerId", getCertificatesHandler);
certificateRoutes.delete("/:certificateId", deleteCertificateHandler);

export default certificateRoutes;
