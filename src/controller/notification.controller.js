import httpStatus from "http-status";
import { sendFirebaseNotification } from "../config/firebase.js";
import { ApiError } from "../errors/ApiError.js";
import ExpoToken from "../models/expoTokenModel.js";

export const registerExpoToken = async (req, res) => {
  try {
    const { expoPushToken } = req.body;
    const userId = req.user.userId;
    console.log({ userId });

    const existingToken = await ExpoToken.findOne({ userId });
    if (existingToken) {
      await ExpoToken.findOneAndUpdate(
        { userId },
        { expoPushToken },
        { new: true }
      );
      return res.status(200).json({ success: true });
    }

    await ExpoToken.create({ userId, expoPushToken });
    res.status(201).json({ success: true });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

export const unRegisterExpoToken = async (req, res) => {
  try {
    const userId = req.user.userId;
    await ExpoToken.findOneAndDelete({ userId });
    res.status(200).json({ success: true });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

export const testFirebaseNotification = async (req, res) => {
  try {
    const { title, body, path, userId } = req.body;
    await sendFirebaseNotification({ userId, title, body, path });
    res.status(200).json({ success: true });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};
