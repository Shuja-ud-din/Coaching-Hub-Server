import httpStatus from "http-status";
import {
  addAdmin,
  getAdmin,
  getAdminDashboardData,
  getAllAdmins,
  toggleAdminStatus,
  updateAdmin,
} from "../services/admin.service.js";
import { ApiError } from "../errors/ApiError.js";

const addAdminHandler = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password, profilePicture } = req.body;
    await addAdmin({
      name,
      email,
      phoneNumber,
      password,
      profilePicture,
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Admin added successfully",
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

const getAllAdminsHandler = async (req, res, next) => {
  try {
    const admins = await getAllAdmins();
    res.status(httpStatus.OK).json({
      success: true,
      data: admins,
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

export const getAdminHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminData = await getAdmin(id);
    res.status(200).json({
      success: true,
      data: adminData,
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

const updateAdminHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, profilePicture, isValid } = req.body;

    await updateAdmin({
      id,
      name,
      email,
      phoneNumber,
      profilePicture,
      isValid,
    });

    res.status(200).json({
      success: true,
      message: "Admin Updated Successfully",
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

const deleteAdminHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteAdmin(id);
    res.status(200).json({
      success: true,
      message: "Admin Deleted Successfully",
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

const toggleAdminStatusHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isValid } = req.body;

    const updatedStatus = await toggleAdminStatus(id, isValid);

    res.status(200).json({
      success: true,
      message: "Admin Updated Successfully",
      isValid: updatedStatus,
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
const getAdminDashboardHandler = async (_req, res, next) => {
  try {
    const dashboardData = await getAdminDashboardData();
    res.status(200).json({
      success: true,
      data: dashboardData,
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
export {
  addAdminHandler,
  getAllAdminsHandler,
  getAdminHandler,
  updateAdminHandler,
  deleteAdminHandler,
  toggleAdminStatusHandler,
  getAdminDashboardHandler,
};
