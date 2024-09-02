import Joi from "joi";
import mongoose from "mongoose";

const schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  workingDays: {
    type: [String],
    required: true,
  },
  workingTimes: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  appointments: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    default: [],
  },

  reviews: {
    type: [
      {
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    default: [],
  },
  services: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    default: [],
  },
  rating: {
    type: String,
    default: 0,
  },
  swarmLink: {
    type: String,
    required: true,
  },
  chats: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    default: [],
  },
  certificates: {
    type: [
      {
        title: { type: String, required: true },
        document: { type: String, required: true },
      },
    ],
    default: [],
  },
});

const Provider = mongoose.model("Provider", schema);

const providerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  profilePicture: Joi.any(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
  address: Joi.string().required(),
  speciality: Joi.string().required(),
  experience: Joi.number().required(),
  about: Joi.string().required(),
  workingDays: Joi.array().items(Joi.string()).required(),
  swarmLink: Joi.string().required(),
  workingTimes: Joi.object({
    start: Joi.string().required(),
    end: Joi.string().required(),
  }).required(),
});

const updateProviderBody = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  profilePicture: Joi.any(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
  speciality: Joi.string().required(),
  experience: Joi.number().required(),
  about: Joi.string().required(),
  workingDays: Joi.array().items(Joi.string()).required(),
  swarmLink: Joi.string().required(),
  workingTimes: Joi.object({
    start: Joi.string().required(),
    end: Joi.string().required(),
  }).required(),
});

const addReviewBody = Joi.object({
  rating: Joi.number().required(),
  comment: Joi.string().required(),
});

export default Provider;
export { providerSchema, updateProviderBody, addReviewBody };
