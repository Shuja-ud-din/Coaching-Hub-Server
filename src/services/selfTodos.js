
import Customer from "../models/customerModel.js";
import SelfTodos from "../models/selfTodos.js";

const addSelfTodos = async (customerId, name, description, status,deadline) => {
  const customerExists = await Customer.findById(customerId);
  if (!customerExists) {
    throw new Error("Customer not found", 404);
  }
  const newTodo = await SelfTodos.create({
    name,
    description,
    status,
    deadline,
    customer: customerExists,
  });
  customerExists.selfTodos.push(newTodo._id);
  await customerExists.save();
  return newTodo;
};

const getAllSelfTodos = async (todoId) => {
  const todos = await SelfTodos.find({ customer: todoId });
  return todos;
};

const updateSelfTodo = async (todoId, data) => {
  const updatedTodo = await SelfTodos.findByIdAndUpdate(todoId, data, {
    new: true,
  });
  if (!updatedTodo) {
    throw new Error("Todo not found", 404);
  }
  return updatedTodo;
};

const completeSelfTodo = async (todoId) => {
  // First, check if the todo exists
  const todoExists = await SelfTodos.findById(todoId);
  
  if (!todoExists) {
    throw new Error("Todo not found");
  }

  // Proceed to update the status if the todo exists
  const completedSelfTodo = await SelfTodos.findByIdAndUpdate(
    todoId,
    { status: "Completed" },
    { new: true }
  );

  return completedSelfTodo;
};


const deleteSelfTodo = async (todoId) => {
  const deletedTodo = await SelfTodos.findByIdAndDelete(todoId);

  if (!deletedTodo) {
    throw new Error("Todos not found", 404);
  }

  //Remove the todo from the associated appointment

  const customer = await Customer.findById(deletedTodo.customer);
  if (customer) {
    customer.selfTodos.pull(todoId);
    await customer.save();
  }
  return deletedTodo;
};

export { addSelfTodos, getAllSelfTodos, updateSelfTodo, deleteSelfTodo,completeSelfTodo };
