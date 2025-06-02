import httpStatus from "http-status";
import App from "../models/appStatus.js";
import { ApiError } from "../errors/ApiError.js";
import { t } from "../utils/i18n.js";

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
  const lang = req.language;
  try {
    const app = await App.findOne();

    res.status(200).json({
      success: true,
      message: t("TIMEZONES_FETCHED_SUCCESSFULLY", lang),
      timezones: app?.timezones || [],
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};

export const getLanguages = async (req, res) => {
  const lang = req.language;
  try {
    const app = await App.findOne();

    const languages = (app?.languages || []).map((language) => ({
      id: language._id,
      name: language.name?.[lang] || language.name?.en || "",
    }));

    res.status(200).json({
      success: true,
      message: t("LANGUAGES_FETCHED_SUCCESSFULLY", lang),
      languages,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};

export const getCountries = async (req, res) => {
  const lang = req.language;
  try {
    const app = await App.findOne();

    const countries =
      app?.countries.map((country) => ({
        id: country._id,
        name: country.name[lang] || country.name.en,
      })) || [];

    res.status(200).json({
      success: true,
      message: t("COUNTRIES_FETCHED_SUCCESSFULLY", lang),
      countries,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};

export const getCities = async (req, res) => {
  const lang = req.language;
  try {
    const app = await App.findOne();

    const cities =
      app?.cities.map((city) => ({
        id: city._id,
        name: city.name[lang] || city.name.en,
      })) || [];

    res.status(200).json({
      success: true,
      message: t("CITIES_FETCHED_SUCCESSFULLY", lang),
      cities,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};

export const getJobTitles = async (req, res) => {
  const lang = req.language;
  try {
    const app = await App.findOne();

    const jobTitles =
      app?.jobTitles.map((job) => ({
        id: job._id,
        name: job.name[lang] || job.name.en,
      })) || [];

    res.status(200).json({
      success: true,
      message: t("JOBTITLES_FETCHED_SUCCESSFULLY", lang),
      jobTitles,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};

export const getCategories = async (req, res) => {
  const lang = req.language;
  try {
    const app = await App.findOne();

    const categories =
      app?.categories.map((cat) => ({
        id: cat._id,
        name: cat.name[lang] || cat.name.en,
      })) || [];

    res.status(200).json({
      success: true,
      message: t("CATEGORIES_FETCHED_SUCCESSFULLY", lang),
      categories,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};
