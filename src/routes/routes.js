import express from "express";
import { authRoutes } from "./auth.js";
import { PATH } from "../constants/routePaths.js";

const routes = express.Router();

const defaultRoutes = [
  {
    path: PATH.AUTH,
    route: authRoutes,
  },
];

defaultRoutes.forEach((route) => {
  routes.use(route.path, route.route);
});

export default routes;
