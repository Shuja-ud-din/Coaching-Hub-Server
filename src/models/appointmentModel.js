import Joi from "joi";
import mongoose from "mongoose";

const schema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Provider",
  },
  // service: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: "Service",
  // },
  status: {
    type: String,
    required: true,
    default: "Scheduled",
  },
  date: {
    type: Date,
    required: true,
  },
});

const Appointment = mongoose.model("Appointment", schema);

const appointmentSchema = Joi.object({
  date: Joi.date().required(),
  customer: Joi.string().required(),
  provider: Joi.string().required(),
  // service: Joi.string().required(),
});

const cancelAppointmentSchema = Joi.object({
  reason: Joi.string().required(),
});

export default Appointment;
export { appointmentSchema, cancelAppointmentSchema };
