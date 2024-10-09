import httpStatus from "http-status";
import { ApiError } from "../errors/ApiError.js";
import {
  addTodos,
  completeTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "../services/todos.service.js";

const addTodosHandler = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const { id: appointmentId } = req.params;
    const todo = await addTodos(appointmentId, name, description, status);
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

const getAllTodosHandler = async (req, res) => {
  try {
    const { id: appointmentId } = req.params;
    const todos = await getAllTodos(appointmentId);
    res.status(200).json({ success: true, data: todos });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

const updateTodosHandler = async (req, res) => {
  try {
    const { id: todoId } = req.params;
    const updatedTodo = await updateTodo(todoId, req.body);
    res.status(200).json({ success: true, data: updatedTodo });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};
const completeTodoHandler = async (req, res) => {

  try {
    const { id: todoId } = req.params;
     await completeTodo(todoId);
    res.status(200).json({ success: true });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

const deleteTodosHandler = async (req, res) => {
  try {
    const { id: todoId } = req.params;
    const deletedTodo = await deleteTodo(todoId);
    res.status(200).json({ success: true, data: deletedTodo });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

export {
  addTodosHandler,
  getAllTodosHandler,
  updateTodosHandler,
  deleteTodosHandler,
  completeTodoHandler,
};
