import httpStatus from "http-status";
import AppStatus from "../models/appStatus.js";
import { ApiError } from "../errors/ApiError.js";

export const checkStatus = async (req, res) => {
  try {
    let appStatus = await AppStatus.findOne();
    if (!appStatus) {
      appStatus = await AppStatus.create({ status: "active" });
    }
    res.status(200).json({ status: appStatus.status });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Error fetching status"
    );
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const appStatus = await AppStatus.findOne();
    if (!appStatus) {
      appStatus = await AppStatus.create({ status: "active" });
    }
    appStatus.status = appStatus.status === "active" ? "inActive" : "active";
    appStatus.save();
    res.status(200).json({
      status: appStatus.status,
      message: "Status toggled successfully",
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Error toggling status"
    );
  }
};
