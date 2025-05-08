import Joi from "joi";
import mongoose from "mongoose";

const schema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    default: Date.now + 1000 * 60 * 10, // 10 minutes
  },
});

const CPToken = mongoose.model("CPToken", schema);

export const forgetPasswordBody = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordBody = Joi.object({
  password: Joi.string().required(),
});

export const verifyForgetPasswordOTPBody = Joi.object({
  otp: Joi.string().required(),
  email: Joi.string().email().required(),
});

export default CPToken;
