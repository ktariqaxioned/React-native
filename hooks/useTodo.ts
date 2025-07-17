// hooks/useTodo.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTodo,
  deleteTodo,
  fetchTodos,
  Todo,
  updateTodo,
} from "../api/todos";

type UpdateTodoParams = {
  id: string;
  data: Partial<Todo>;
};

export const useTodos = () => {
  const queryClient = useQueryClient();

  const todosQuery = useQuery({
    queryFn: fetchTodos,
    queryKey: ["todos"],
  });

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      todosQuery.refetch();
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, data }: UpdateTodoParams) => updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      todosQuery.refetch();
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      todosQuery.refetch();
    },
  });

  return {
    todosQuery,
    addTodoMutation,
    updateTodoMutation,
    deleteTodoMutation,
  };
};
