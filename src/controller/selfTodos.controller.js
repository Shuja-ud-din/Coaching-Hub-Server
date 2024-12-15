import httpStatus from "http-status";
import { ApiError } from "../errors/ApiError.js";
import {
  addSelfTodos,
  completeSelfTodo,
  deleteSelfTodo,
  getAllSelfTodos,
  updateSelfTodo,
} from "../services/selfTodos.service.js";

const addSelfTodosHandler = async (req, res) => {
  try {
    const { name, description, status, deadline } = req.body;
    const { id: customerId } = req.params;
    const todo = await addSelfTodos(
      customerId,
      name,
      description,
      status,
      deadline
    );

    // Define the data object with key-value pairs
    const data = {
      customer: todo.customer._id,
      name: todo.name,
      description: todo.description,
      deadline: todo.deadline,
      status: todo.status,
      _id: todo._id,
      __v: todo.__v,
    };

    res.status(201).json({ success: true, data });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

const getAllSelfTodosHandler = async (req, res) => {
  try {
    const { id: customerId } = req.params;
    const todos = await getAllSelfTodos(customerId);
    res.status(200).json({ success: true, data: todos });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

const updateSelfTodosHandler = async (req, res) => {
  try {
    const { id: todoId } = req.params;
    const updatedTodo = await updateSelfTodo(todoId, req.body);
    res.status(200).json({ success: true, data: updatedTodo });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};
const completeSelfTodoHandler = async (req, res) => {
  try {
    const { id: todoId } = req.params;
    await completeSelfTodo(todoId);
    res.status(200).json({ success: true });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

const deleteSelfTodosHandler = async (req, res) => {
  try {
    const { id: todoId } = req.params;
    const deletedTodo = await deleteSelfTodo(todoId);
    res.status(200).json({ success: true, data: deletedTodo });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

export {
  addSelfTodosHandler,
  getAllSelfTodosHandler,
  updateSelfTodosHandler,
  deleteSelfTodosHandler,
  completeSelfTodoHandler,
};
