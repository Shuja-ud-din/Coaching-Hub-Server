import express from "express";
import { authRoutes } from "./auth.js";
import { PATH } from "../constants/routePaths.js";
import { adminRoutes } from "./admin.js";
import { providerRoutes } from "./provider.js";
import { uploadRoutes } from "./upload.js";
import appointmentRoutes from "./appointment.js";

const routes = express.Router();

const defaultRoutes = [
  {
    path: PATH.AUTH,
    route: authRoutes,
  },
  {
    path: PATH.ADMIN,
    route: adminRoutes,
  },
  {
    path: PATH.PROVIDER,
    route: providerRoutes,
  },
  {
    path: PATH.UPLOAD,
    route: uploadRoutes,
  },
  {
    path: PATH.APPOINTMENT,
    route: appointmentRoutes,
  },
];

defaultRoutes.forEach((route) => {
  routes.use(route.path, route.route);
});

export default routes;
