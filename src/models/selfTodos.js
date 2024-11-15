import mongoose from "mongoose";
import Joi from "joi";

const todosSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
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
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
});

const SelfTodos = mongoose.model("SelfTodos", todosSchema);

const addSelfTodo = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  deadline:Joi.date().required(),
  status: Joi.string().required(),
});
const updateSelfTodos = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().required(),
});

export default SelfTodos;

export { addSelfTodo, updateSelfTodos };
