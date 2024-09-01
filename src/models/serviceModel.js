import Joi from "joi";
import mongoose from "mongoose";

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
});

const Service = mongoose.model("Service", schema);

const serviceSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  image: Joi.string().required(),
  isValid: Joi.boolean(),
  provider: Joi.string().required(),
});

const updatedServiceSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  image: Joi.string(),
  isValid: Joi.boolean(),
});

export default Service;
export { serviceSchema, updatedServiceSchema };
