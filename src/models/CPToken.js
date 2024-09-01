import Joi from "joi";
import mongoose from "mongoose";

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
});

const CPToken = mongoose.model("CPToken", schema);

export const forgetPasswordBody = Joi.object({
  phoneNumber: Joi.string().required(),
});

export const resetPasswordBody = Joi.object({
  token: Joi.string().required(),
  userId: Joi.string().required(),
  password: Joi.string().required(),
});

export const verifyForgetPasswordOTPBody = Joi.object({
  otp: Joi.string().required(),
  userId: Joi.string().required(),
});

export default CPToken;
