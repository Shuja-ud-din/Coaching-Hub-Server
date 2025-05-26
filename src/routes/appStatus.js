import express from "express";
import {
  checkStatus,
  getCategories,
  getCities,
  getCountries,
  getJobTitles,
  getLanguages,
  getTimezones,
  toggleStatus,
} from "../controller/appStatus.controller.js";
import { catchAsync } from "../utils/catchAsync.js";

const appStatusRoutes = express.Router();

appStatusRoutes.put("/toggle-status", catchAsync(toggleStatus));

appStatusRoutes.get("/status", catchAsync(checkStatus));

appStatusRoutes.get("/timezones", catchAsync(getTimezones));

appStatusRoutes.get("/languages", catchAsync(getLanguages));

appStatusRoutes.get("/countries", catchAsync(getCountries));

appStatusRoutes.get("/cities", catchAsync(getCities));

appStatusRoutes.get("/job-titles", catchAsync(getJobTitles));

appStatusRoutes.get("/categories", catchAsync(getCategories));

export default appStatusRoutes;
