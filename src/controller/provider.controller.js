import httpStatus from "http-status";
import {
  createProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
} from "../services/provider.service.js";
import { ApiError } from "../errors/ApiError.js";

const createProviderHandler = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      address,
      password,
      speciality,
      experience,
      about,
      workingDays,
      workingTimes,
      profilePicture,
      swarmLink,
    } = req.body;

    const id = await createProvider({
      name,
      email,
      phoneNumber,
      address,
      password,
      speciality,
      experience,
      about,
      workingDays,
      workingTimes,
      profilePicture,
      swarmLink,
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Provider created successfully",
      id,
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
    const data = await getProviderById(id, req);

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
export {
  createProviderHandler,
  getAllProvidersHandler,
  getProviderByIdHandler,
  updateProviderHandler,
};
