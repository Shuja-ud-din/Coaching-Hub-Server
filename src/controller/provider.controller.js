import httpStatus from "http-status";
import { createProvider, getAllProviders } from "../services/provider.service";
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

export { createProviderHandler, getAllProvidersHandler };
