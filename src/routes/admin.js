import express from "express";
import { adminAuthentication } from "../middlewares/authentication";
import { getAllAdminsHandler } from "../controller/admin.controller";

const adminRoutes = express.Router();

adminRoutes.get("/", adminAuthentication, getAllAdminsHandler);

export { adminRoutes };
