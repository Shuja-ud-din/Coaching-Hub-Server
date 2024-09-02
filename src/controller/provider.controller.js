import httpStatus from "http-status";
import {
  createProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
} from "../services/provider.service";
import { ApiError } from "../errors/ApiError";

const createProviderHandler = async (req, res, next) => {
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

    await createProvider({
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
    });
  } catch (error) {
    next(
      new ApiError(
        error.statusCode || httpStatus.BAD_REQUEST,
        error.message || "Internal server error"
      )
    );
  }
};

const getAllProvidersHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    const provider = await getAllProviders(userId, role);

    res.status(httpStatus.OK).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(
      new ApiError(
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Internal server error"
      )
    );
  }
};

const getProviderByIdHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const data = await getProviderById(id, req.user);

    res.status(httpStatus.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    next(
      new ApiError(
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Internal server error"
      )
    );
  }
};

const updateProviderHandler = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const result = await updateProvider(id, data);

    res.status(httpStatus.OK).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    next(
      new ApiError(
        error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Internal server error"
      )
    );
  }
};
export {
  createProviderHandler,
  getAllProvidersHandler,
  getProviderByIdHandler,
  updateProviderHandler,
};
