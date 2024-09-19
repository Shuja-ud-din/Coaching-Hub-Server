import mongoose from "mongoose";
import Joi from "joi";

const todosSchema = mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Todos = mongoose.model("Todos", todosSchema);

const todos = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.boolean().required(),
});
const updateTodos = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.boolean().required(),
});

export default Todos;

export { todos, updateTodos };
