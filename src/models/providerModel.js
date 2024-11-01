import Joi from "joi";
import mongoose from "mongoose";

const schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: "Pending",
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
  timeZone: {
    type: String,
    required: true,
    default: "UTC",
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
  // services: {
  //   type: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Service",
  //     },
  //   ],
  //   default: [],
  // },
  rating: {
    type: String,
    default: 0,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certificate",
      },
    ],
    default: [],
  },
  language: {
    type: [String],
    enum: [
      "English",
      "Arabic",
      "Italian",
      "Hindi",
      "Russian",
      "Filipino",
      "Urdu",
      "French",
      "Spanish",
      "German",
    ],
    default: ["English"],
  },
  sessionDuration: {
    type: String,
    required: true,
    default: "30",
  },
  sessionPrice: {
    type: String,
    required: true,
    default: "10",
  },
  countryOfResidence: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  degreeName: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: true,
  },
  yearOfPassingDegree: {
    type: String,
    required: true,
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
  timeZone: Joi.string().required(),
  workingTimes: Joi.object({
    start: Joi.string().required(),
    end: Joi.string().required(),
  }).required(),
  certificates: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        document: Joi.string().required(),
      })
    )
    .empty(),
  language: Joi.array()
    .items(
      Joi.string().valid(
        "English",
        "Arabic",
        "Italian",
        "Hindi",
        "Russian",
        "Filipino",
        "Urdu",
        "French",
        "Spanish",
        "German"
      )
    )
    .required()
    .min(1),
  sessionDuration: Joi.string().required(),
  sessionPrice: Joi.string().required(),
  countryOfResidence: Joi.string().required(),
  nationality: Joi.string().required(),
  degreeName: Joi.string().required(),
  institute: Joi.string().required(),
  yearOfPassingDegree: Joi.string().required(),
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
