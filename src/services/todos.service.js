import Todos from "../models/todosModel.js";

const addTodos = async (name, description, status) => {
  const todos = await Todos.create({
    name,
    description,
    status,
  });
  return todos;
};

// const updateTodos = async(appointmentId, todosID,name,description,status)=>{
//     const
// }
