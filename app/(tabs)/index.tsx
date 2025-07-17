import { Todo } from "@/api/todos";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useTodos } from "@/hooks/useTodo";
import { CircleCheck, Edit, ListTree, Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import uuid from "react-native-uuid";

export default function HomeScreen() {
  const {
    todosQuery,
    addTodoMutation,
    deleteTodoMutation,
    updateTodoMutation,
  } = useTodos();

  const [title, setTitle] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");

  const handleAddTodo = () => {
    if (!title.trim()) return;

    addTodoMutation.mutate({
      id: uuid.v4(),
      title,
      completed: false,
    });
    setTitle("");
  };

  const toggleCompleted = (todoId: string, current: boolean, data?: Todo) => {
    updateTodoMutation.mutate({
      id: todoId,
      data: { ...data, completed: !current },
    });
  };

  const startEditing = (todoId: string, currentTitle: string) => {
    setEditingId(todoId);
    setEditedTitle(currentTitle);
  };

  const saveEditedTitle = (todoId: string) => {
    if (!editedTitle.trim()) return;

    updateTodoMutation.mutate({
      id: todoId,
      data: { title: editedTitle },
    });

    setEditingId(null);
    setEditedTitle("");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <ListTree size={310} color="#ffffffff" style={styles.reactLogo} />
      }
    >
      <View style={styles.createTodo}>
        <TextInput
          value={title}
          placeholder="Title"
          style={styles.input}
          onChange={(e) => setTitle(e.nativeEvent.text)}
        />

        <Button title="Create" onPress={handleAddTodo} />
      </View>

      {todosQuery.data
        ?.slice()
        .reverse()
        .map((todo) => (
          <View style={styles.list} key={todo.id}>
            <View style={{ flex: 1 }}>
              {editingId === todo.id ? (
                <TextInput
                  style={styles.input}
                  value={editedTitle}
                  onChangeText={setEditedTitle}
                />
              ) : (
                <Text style={todo.completed ? styles.completedText : undefined}>
                  {todo.title}
                </Text>
              )}
            </View>
            <View style={styles.checkbox}>
              {editingId === todo.id ? (
                <TouchableOpacity onPress={() => saveEditedTitle(todo.id)}>
                  <CircleCheck size={22} color="#4CAF50" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => startEditing(todo.id, todo.title)}
                >
                  <Edit size={22} color="blue" />
                </TouchableOpacity>
              )}
              <Checkbox
                status={todo.completed ? "checked" : "unchecked"}
                onPress={() => toggleCompleted(todo.id, todo.completed, todo)}
              />
              <TouchableOpacity
                onPress={() => deleteTodoMutation.mutate(todo.id)}
              >
                <Trash2 size={22} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      {todosQuery.isLoading && <Text>Loading...</Text>}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
  },
  list: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    padding: 16,
    borderRadius: 10,
    gap: 16,
  },
  checkbox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  completedText: {
    textDecorationLine: "line-through",
  },
  todoText: {
    fontSize: 18,
  },
  createTodo: {
    display: "flex",
    gap: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    padding: 16,
    borderRadius: 10,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
