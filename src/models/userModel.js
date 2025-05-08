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
  name: joi.string().required().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),
  email: joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
  phoneNumber: joi.number().required().messages({
    "number.base": "Phone number must be a number.",
    "any.required": "Phone number is required.",
  }),
  password: joi.string().required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
  profilePicture: joi.string().optional().messages({
    "string.base": "Profile picture must be a string.",
  }),
});

// Login Schema
const loginSchema = joi
  .object({
    phoneNumber: joi.number().messages({
      "number.base": "Phone number must be a number.",
    }),
    email: joi.string().email().messages({
      "string.email": "Email must be a valid email address.",
    }),
    password: joi.string().required().messages({
      "string.empty": "Password is required.",
      "any.required": "Password is required.",
    }),
  })
  .xor("phoneNumber", "email")
  .messages({
    "object.missing": "Either phone number or email is required.",
    "object.xor": "Only one of phone number or email should be provided.",
  });

const updateSchema = joi.object({
  name: joi.string().required().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),
  email: joi.string().email().messages({
    "string.email": "Email must be a valid email address.",
  }),
  phoneNumber: joi.number().required().messages({
    "number.base": "Phone number must be a number.",
    "any.required": "Phone number is required.",
  }),
  password: joi.string().required().messages({
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
  profilePicture: joi.string().optional().messages({
    "string.base": "Profile picture must be a string.",
  }),
});

const toggleValidityBody = joi.object({
  isValid: joi.boolean().required().messages({
    "boolean.base": "isValid must be a boolean value.",
    "any.required": "isValid is required.",
  }),
});

const generateOTPBody = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
});

const verifyUserBody = joi.object({
  otp: joi.string().required().messages({
    "string.empty": "OTP is required.",
    "any.required": "OTP is required.",
  }),
  email: joi.string().email().messages({
    "string.email": "Email must be a valid email address.",
  }),
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
