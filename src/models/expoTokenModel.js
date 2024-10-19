import Joi from "joi";
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expoPushToken: {
    type: String,
    required: true,
  },
});

const ExpoToken = mongoose.model("ExpoToken", schema);

export const registerExpoTokenBody = Joi.object({
  expoPushToken: Joi.string().required(),
});

export default ExpoToken;
