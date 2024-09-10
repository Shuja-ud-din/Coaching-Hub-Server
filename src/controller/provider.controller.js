import httpStatus from "http-status";
import { ApiError } from "../errors/ApiError.js";
import sendMail from "../utils/sendMail.js";
import {
  createProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
} from "../services/provider.service.js";
import {
  addCertificate,
  getCertificatesByProvider,
  updateCertificate,
  deleteCertificate,
} from "../services/certificate.service.js";
import Provider from "../models/providerModel.js";

const createProviderHandler = async (req, res) => {
  try {
    const { body } = req;
    const { certificates, name, phoneNumber, password, email, language } = body;

    const providerData = await createProvider(body);

    const provider = await Provider.findById(providerData._id);

    const certificatePromises = certificates.map(async (certificate) => {
      const tempCertificate = await addCertificate(
        provider._id.toString(),
        certificate.title,
        certificate.document
      );

      provider.certificates.push(tempCertificate._id);
    });

    await Promise.all(certificatePromises);
    await provider.save();

    sendMail(
      {
        to: email,
        subject: "Welcome to Coaching Hub",
        text: `Hello ${name}, Welcome to Coaching Hub. We are glad to have you on board. You can now login to your account using the following credentials:
        Phone Number: ${phoneNumber}
        Password: ${password}`,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      }
    );

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Provider created successfully",
    });
  } catch (error) {
    console.log(error);

    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

const getAllProvidersHandler = async (req, res) => {
  try {
    const userId = req.userId;
    const role = req.role;

    const provider = await getAllProviders(userId, role);

    res.status(httpStatus.OK).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Internal server error"
    );
  }
};

const getProviderByIdHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await getProviderById(id, req.user);

    res.status(httpStatus.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Internal server error"
    );
  }
};

const updateProviderHandler = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const result = await updateProvider(id, data);

    res.status(200).json({
      success: true,
      message: "Provider Updated Successfully",
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Internal server error"
    );
  }
};

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
  createProviderHandler,
  getAllProvidersHandler,
  getProviderByIdHandler,
  updateProviderHandler,

  // Exporting the certificate handlers
  addCertificateHandler,
  getCertificatesHandler,
  updateCertificateHandler,
  deleteCertificateHandler,
};
