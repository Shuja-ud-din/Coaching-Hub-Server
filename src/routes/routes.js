import express from "express";
import { authRoutes } from "./auth.js";
import { PATH } from "../constants/routePaths.js";
import { adminRoutes } from "./admin.js";
import { providerRoutes } from "./provider.js";
import { uploadRoutes } from "./upload.js";
import appointmentRoutes from "./appointment.js";
import { privateRoutes } from "./private.js";
import customerRoutes from "./customer.js";
import notificationsRoutes from "./notification.js";
import appStatusRoutes from "./appStatus.js";
import chatRoutes from "./chat.js";

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
    path: PATH.CHAT,
    route: chatRoutes,
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
    path: PATH.CUSTOMER,
    route: customerRoutes,
  },
  {
    path: PATH.APPOINTMENT,
    route: appointmentRoutes,
  },
  {
    path: PATH.NOTIFICATION,
    route: notificationsRoutes,
  },
  {
    path: PATH.PRIVATE,
    route: privateRoutes,
  },
  {
    path: PATH.APPSTATUS,
    route: appStatusRoutes,
  },
];

defaultRoutes.forEach((route) => {
  routes.use(route.path, route.route);
});

export default routes;
