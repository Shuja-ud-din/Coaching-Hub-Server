import mongoose from "mongoose";
import Joi from "joi";

const schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  balance: {
    type: Number,
    default: 0,
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
  chats: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    default: [],
  },
  favorites: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider",
      },
    ],
    default: [],
  },
  selfTodos: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SelfTodos",
      },
    ],
    default: [],
  },
});

const Customer = mongoose.model("Customer", schema);

const customerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
  profilePicture: Joi.any(),
});

const customerUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phoneNumber: Joi.string(),
  profilePicture: Joi.any(),
  isValid: Joi.boolean(),
});

export default Customer;
export { customerSchema, customerUpdateSchema };
