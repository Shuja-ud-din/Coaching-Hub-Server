import httpStatus from "http-status";
import { ApiError } from "../errors/ApiError.js";
import {
  addCertificate,
  getCertificatesByProvider,
  updateCertificate,
  deleteCertificate,
} from "../services/certificate.service.js";

// Controller to handle adding a certificate
const addCertificateHandler = async (req, res) => {
  const { providerId } = req.params;
  const { title, document } = req.body;

  try {
    const certificate = await addCertificate(providerId, title, document);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Certificate added successfully",
      data: certificate,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
const getCertificatesHandler = async (req, res) => {
  const { providerId } = req.params;
  try {
    const certificates = await getCertificatesByProvider(providerId);
    res.status(httpStatus.OK).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

// Controller to handle updating a certificate
const updateCertificateHandler = async (req, res) => {
  const { certificateId } = req.params;
  const { title, document } = req.body;

  try {
    const certificate = await updateCertificate(certificateId, title, document);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Certificate updated successfully",
      data: certificate,
    });
  } catch (error) {
    new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

// Controller to handle deleting a certificate
const deleteCertificateHandler = async (req, res) => {
  const { certificateId } = req.params;

  try {
    const certificate = await deleteCertificate(certificateId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

export {
  addCertificateHandler,
  getCertificatesHandler,
  updateCertificateHandler,
  deleteCertificateHandler,
};
