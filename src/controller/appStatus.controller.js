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

export const getVersion = async (req, res) => {
  try {
    const { platform, version } = req.query;

    if (!platform || !version) {
      throw new ApiError(400, "Platform and version are required");
    }

    const appStatus = await AppStatus.findOne();
    if (platform === "ios") {
      res.status(200).json({
        success: true,
        message: "App version checked",
        version: appStatus.iosVersion,
        updateAvailable: version !== appStatus.iosVersion,
        supported: version === appStatus.iosVersion,
      });
    } else if (platform === "android") {
      res.status(200).json({
        success: true,
        message: "App version checked",
        version: appStatus.androidVersion,
        updateAvailable: version !== appStatus.androidVersion,
        supported: version === appStatus.androidVersion,
      });
    } else {
      throw new ApiError(400, "Invalid platform");
    }
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Error fetching version"
    );
  }
};
