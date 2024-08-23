import mongoose from "mongoose";
import joi from "joi";
import Joi from "joi";

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Customer",
  },
  otp: {
    type: String,
  },
  isValid: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  notifications: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    default: [],
  },
});

const User = mongoose.model("User", schema);

// schema
const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  phoneNumber: joi.number().required(),
  password: joi.string().required(),
  profilePicture: joi.string().optional(),
});

const loginSchema = joi.object({
  phoneNumber: joi.number().required(),
  password: joi.string().required(),
});

const updateSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  phoneNumber: joi.number().required(),
  password: joi.string().required(),
  profilePicture: joi.string().optional(),
});

const toggleValidityBody = Joi.object({
  isValid: Joi.boolean().required(),
});

const verifyUserBody = Joi.object({
  otp: Joi.string().required(),
  phoneNumber: Joi.string().required(),
});

const generateOTPBody = Joi.object({
  phoneNumber: Joi.string().required(),
});

export default User;
export {
  userSchema,
  loginSchema,
  updateSchema,
  toggleValidityBody,
  verifyUserBody,
  generateOTPBody,
};
