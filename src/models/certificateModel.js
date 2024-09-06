import Joi from "joi";
import mongoose from "mongoose";

const certificateSchema = mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  document: {
    type: String,
    required: true,
  },
});

const Certificate = mongoose.model("Certificate", certificateSchema);

const certificate = Joi.object({
  title: Joi.string().required(),
  document: Joi.string().required(),
});
const updateCertificate = Joi.object({
  title: Joi.string().required(),
  document: Joi.string().required(),
});

export default Certificate;

export { certificate, updateCertificate };
