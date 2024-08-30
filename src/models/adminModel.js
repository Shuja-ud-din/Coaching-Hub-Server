import Joi from "joi";
import mongoose from "mongoose";

const schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Admin = mongoose.model("Admin", schema);

const adminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
});

const updateAdminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  profilePicture: Joi.any(),
  isValid: Joi.boolean(),
});

export default Admin;
export { adminSchema, updateAdminSchema };
