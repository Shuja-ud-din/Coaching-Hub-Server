import Appointment from "../models/appointmentModel.js";
import Todos from "../models/todosModel.js";

const addTodos = async (appointmentId, name, description, status) => {
  const appointmentExists = await Appointment.findById(appointmentId);
  if (!appointmentExists) {
    throw new Error("Appointment not found", 404);
  }
  const newTodo = await Todos.create({
    name,
    description,
    status,
    appointment: appointmentId,
  });
  appointmentExists.todos.push(newTodo._id);
  await appointmentExists.save();
  return newTodo;
};

const getAllTodos = async (appointmentId) => {
  const todos = await Todos.find({ appointment: appointmentId });
  return todos;
};

const updateTodo = async (todoId, data) => {
  const updatedTodo = await Todos.findByIdAndUpdate(todoId, data, {
    new: true,
  });
  if (!updatedTodo) {
    throw new Error("Todo not found", 404);
  }
  return updatedTodo;
};

const deleteTodo = async (todoId) => {
  const deletedTodo = await Todos.findByIdAndDelete(todoId);

  if (!deletedTodo) {
    throw new Error("Todos not found", 404);
  }

  //Remove the todo from the associated appointment

  const appointment = await Appointment.findById(deletedTodo.appointment);
  if (appointment) {
    appointment.todos.pull(todoId);
    await appointment.save();
  }
  return deletedTodo;
};

export { addTodos, getAllTodos, updateTodo, deleteTodo };
