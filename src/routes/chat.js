import express from "express";
import {
  adminAuthentication,
  authentication,
} from "../middlewares/authentication.js";
import bodyValidator from "../validation/bodyValidator.js";
import { createChatBody } from "../models/chatModel.js";
import * as chatService from "../services/chat.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const chatRoutes = express.Router();

chatRoutes.get(
  "/support",
  adminAuthentication,
  catchAsync(chatService.getSupportChats)
);

chatRoutes.get(
  "/appointments",
  adminAuthentication,
  catchAsync(chatService.getAppointmentChats)
);

chatRoutes.get("/user/", authentication, catchAsync(chatService.getAllChats));

chatRoutes.post(
  "/",
  authentication,
  bodyValidator(createChatBody),
  catchAsync(chatService.createChat)
);
chatRoutes.get(
  "/onlineUsers",
  authentication,
  catchAsync(chatService.getOnlineUsers)
);
export default chatRoutes;
