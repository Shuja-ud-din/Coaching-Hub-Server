import httpStatus from "http-status";
import App from "../models/appStatus.js";
import { ApiError } from "../errors/ApiError.js";

export const checkStatus = async (req, res) => {
  try {
    let appStatus = await App.findOne();
    if (!appStatus) {
      appStatus = await App.create({ status: "active" });
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
    const appStatus = await App.findOne();
    if (!appStatus) {
      appStatus = await App.create({ status: "active" });
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

    const appStatus = await App.findOne();
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

export const getTimezones = async (req, res) => {
  try {
    const app = await App.findOne();
    res.status(200).json({
      success: true,
      message: "Timezones fetched successfully",
      timezones: app?.timezones || [],
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Error fetching timezones"
    );
  }
};

export const getLanguages = async (req, res) => {
  try {
    const app = await App.findOne();

    const languages =
      app?.languages.map((language) => ({
        id: language._id,
        name: language.name,
      })) || [];

    res.status(200).json({
      success: true,
      message: "Languages fetched successfully",
      languages,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Error fetching languages"
    );
  }
};

export const getCountries = async (req, res) => {
  try {
    const app = await App.findOne();

    const countries =
      app?.countries.map((country) => ({
        id: country._id,
        name: country.name,
      })) || [];

    res.status(200).json({
      success: true,
      message: "Countries fetched successfully",
      countries,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Error fetching countries"
    );
  }
};

export const getCities = async (req, res) => {
  try {
    const app = await App.findOne();
    const cities =
      app?.cities.map((city) => ({
        id: city._id,
        name: city.name,
      })) || [];

    res.status(200).json({
      success: true,
      message: "Cities fetched successfully",
      cities,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Error fetching cities"
    );
  }
};

export const getJobTitles = async (req, res) => {
  try {
    const app = await App.findOne();
    const jobTitles = app?.jobTitles || [];
    res.status(200).json({
      success: true,
      message: "Job titles fetched successfully",
      jobTitles,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Error fetching job titles"
    );
  }
};

export const getCategories = async (req, res) => {
  try {
    const app = await App.findOne();
    const categories =
      app?.categories.map((category) => ({
        id: category._id,
        name: category.name,
      })) || [];

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Error fetching categories"
    );
  }
};
