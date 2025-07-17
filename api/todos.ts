import axios from "axios";

const API_URL = "http://localhost:3005/todos";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export const fetchTodos = async (): Promise<Todo[]> => {
  const { data } = await axios.get<Todo[]>(API_URL);

  return data;
};
export const addTodo = async (newTodo: Todo): Promise<Todo> => {
  const { data } = await axios.post<Todo>(API_URL, newTodo);
  return data;
};
export const updateTodo = async (
  todoId: string,
  updatedTodo: Partial<Todo>
): Promise<Todo> => {
  const { data } = await axios.put(`${API_URL}/${todoId}`, updatedTodo);
  return data;
};

export const deleteTodo = async (todoId: string): Promise<string> => {
  try {
    const response = await axios.delete(`${API_URL}/${todoId}`);
    return todoId;
  } catch (error) {
    throw error;
  }
};
