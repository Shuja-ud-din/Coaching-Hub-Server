import httpStatus from "http-status";
import { ApiError } from "../errors/ApiError.js";
import sendMail from "../utils/sendMail.js";
import {
  addReview,
  createProvider,
  getAllProviders,
  getProviderById,
  getProviderReviews,
  updateProvider,
} from "../services/provider.service.js";
import {
  addCertificate,
  getCertificatesByProvider,
  updateCertificate,
  deleteCertificate,
} from "../services/certificate.service.js";
import Provider from "../models/providerModel.js";
import { welcomeEmailTemplate } from "../templates/welcomeEmailTemplate.js";

const createProviderHandler = async (req, res) => {
  try {
    const { body } = req;
    const {
      certificates,
      name,
      phoneNumber,
      password,
      email,
      language,
      sessionPrice,
      sessionDuration,
      countryOfResidence,
      nationality,
      degreeName,
      institute,
      yearOfPassingDegree,
    } = body;

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

    if (req?.user?.role === "Super Admin" || req?.user?.role === "Admin") {
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
    } else {
          sendMail(
            {
              to: email,
              subject: "Welcome to Coaching Hub 🌟",
              html: welcomeEmailTemplate(name),
            },
            (err, info) => {
              if (err) {
              console.log(err);
              } else {
              console.log(info);
              }
            }
          );

    }

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Coach created successfully",
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
    const userId = req.user.userId;
    const role = req.user.role;

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

const getProviderReviewsHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await getProviderReviews(id);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addReviewHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    await addReview(id, rating, comment, req.user.userId, req.user.role);

    res.status(200).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
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

const approveProviderHandler = async (req, res) => {
  try {
    const { providerId } = req.params;
    const provider = await Provider.findById(providerId);

    if (!provider) {
      throw new ApiError(404, "Provider not found");
    }

    provider.status = "Approved";
    await provider.save();

    sendMail(
      {
        to: provider.email,
        subject: "Provider Approval",
        text: `Hello ${provider.name}, Your application has been approved. You can now login to your account and start your journey with Coaching Hub.`,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "Provider approved successfully",
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

const blockProviderHandler = async (req, res) => {
  try {
    const { providerId } = req.params;
    const provider = await Provider.findById(providerId);

    if (!provider) {
      throw new ApiError(404, "Provider not found");
    }

    provider.status = "Blocked";
    await provider.save();

    sendMail();

    res.status(200).json({
      success: true,
      message: "Provider blocked successfully",
    });
  } catch (error) {
    throw new ApiError(
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
  addCertificateHandler,
  getCertificatesHandler,
  updateCertificateHandler,
  deleteCertificateHandler,
  addReviewHandler,
  getProviderReviewsHandler,
  approveProviderHandler,
  blockProviderHandler,
};
