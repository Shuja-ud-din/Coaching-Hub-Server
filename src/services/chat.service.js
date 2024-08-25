import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import { ApiError } from "../errors/ApiError.js";
import httpStatus from "http-status";

export const createSupportChat = async ({ userId }) => {
  const superAdmin = await User.findOne({ role: "Super Admin" });

  try {
    const chat = await Chat.create({
      user1: superAdmin._id,
      user2: userId,
      type: "Support",
    });
    return chat;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};
