// Page d'édition de tâche
import React from "react";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import tw from "twrnc";
import { useTasks } from "@/contexts/TasksContext";
import { Task, Subtask } from "@/types/task.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

export default function TaskEdit() {
  const taskId = useLocalSearchParams().id;
  const { getTasks, deleteTask, updateTask } = useTasks();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const tasks = await getTasks();
        const foundTask = tasks.find(
          (task: Task) => task.id === Number(taskId)
        );
        if (foundTask) {
          setTask(foundTask);
          setEditedTask({
            ...foundTask,
            subtasks: [...(foundTask.subtasks || [])],
          });
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleDelete = async () => {
    try {
      await deleteTask(taskId as string);
      router.replace("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const taskData = {
        description: editedTask.description,
        subtasks: editedTask.subtasks?.map((subtask) => ({
          description: subtask.description,
          is_completed: subtask.is_completed,
        })),
      };

      await updateTask(taskId as string, taskData);
      setIsEditing(false);

      // Refresh the task data
      const tasks = await getTasks();
      const updatedTask = tasks.find(
        (task: Task) => task.id === Number(taskId)
      );
      if (updatedTask) {
        setTask(updatedTask);
        setEditedTask({
          ...updatedTask,
          subtasks: [...(updatedTask.subtasks || [])],
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;

    const newSubtaskObj = {
      description: newSubtask,
      is_completed: false,
    };

    setEditedTask((prev) => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), newSubtaskObj],
    }));
    setNewSubtask("");
  };

  const handleDeleteSubtask = (index: number) => {
    setEditedTask((prev) => {
      const updatedSubtasks = [...(prev.subtasks || [])];
      updatedSubtasks.splice(index, 1);
      return {
        ...prev,
        subtasks: updatedSubtasks,
      };
    });
  };

  const handleToggleSubtask = (index: number) => {
    setEditedTask((prev) => {
      const updatedSubtasks = [...(prev.subtasks || [])];
      updatedSubtasks[index] = {
        ...updatedSubtasks[index],
        is_completed: !updatedSubtasks[index].is_completed,
      };
      return {
        ...prev,
        subtasks: updatedSubtasks,
      };
    });
  };

  if (!task) {
    return (
      <SafeAreaView style={tw`flex-1 p-4 bg-white dark:bg-gray-900`}>
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 p-4 bg-white dark:bg-gray-900`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          Task Details
        </Text>
        <View style={tw`flex-row`}>
          {isEditing ? (
            <>
              <TouchableOpacity
                onPress={handleUpdate}
                style={tw`bg-green-500 p-2 rounded-lg mr-2`}
              >
                <Text style={tw`text-white`}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(false);
                  setEditedTask(task);
                }}
                style={tw`bg-gray-500 p-2 rounded-lg`}
              >
                <Text style={tw`text-white`}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={tw`bg-blue-500 p-2 rounded-lg mr-2`}
              >
                <Text style={tw`text-white`}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={tw`bg-red-500 p-2 rounded-lg`}
              >
                <Text style={tw`text-white`}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {isEditing ? (
        <View>
          <TextInput
            style={tw`border p-2 rounded-lg mb-2 text-black dark:text-white`}
            value={editedTask.description}
            onChangeText={(text) =>
              setEditedTask((prev) => ({ ...prev, description: text }))
            }
            placeholder="Task description"
          />

          <View style={tw`mt-4`}>
            <Text style={tw`text-lg font-bold text-black dark:text-white mb-2`}>
              Subtasks
            </Text>
            <View style={tw`flex-row mb-2`}>
              <TextInput
                style={tw`flex-1 border p-2 rounded-lg mr-2 text-black dark:text-white`}
                value={newSubtask}
                onChangeText={setNewSubtask}
                placeholder="New subtask"
              />
              <TouchableOpacity
                onPress={handleAddSubtask}
                style={tw`bg-blue-500 p-2 rounded-lg`}
              >
                <Text style={tw`text-white`}>Add</Text>
              </TouchableOpacity>
            </View>

            {(editedTask.subtasks || []).map((subtask, index) => (
              <View
                key={index}
                style={tw`flex-row items-center justify-between p-2 border rounded-lg mb-2`}
              >
                <TouchableOpacity
                  onPress={() => handleToggleSubtask(index)}
                  style={tw`flex-row items-center flex-1`}
                >
                  <View
                    style={[
                      tw`w-5 h-5 rounded-full border mr-2`,
                      subtask.is_completed
                        ? tw`bg-green-500`
                        : tw`bg-transparent`,
                    ]}
                  />
                  <Text
                    style={[
                      tw`text-black dark:text-white`,
                      subtask.is_completed && tw`line-through text-gray-500`,
                    ]}
                  >
                    {subtask.description}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteSubtask(index)}
                  style={tw`p-2`}
                >
                  <Text style={tw`text-red-500`}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View>
          <Text style={tw`text-lg text-black dark:text-white`}>
            {task.description}
          </Text>

          {task.subtasks && task.subtasks.length > 0 && (
            <View style={tw`mt-4`}>
              <Text
                style={tw`text-lg font-bold text-black dark:text-white mb-2`}
              >
                Subtasks
              </Text>
              {task.subtasks.map((subtask, index) => (
                <View
                  key={index}
                  style={tw`flex-row items-center p-2 border rounded-lg mb-2`}
                >
                  <View
                    style={[
                      tw`w-5 h-5 rounded-full border mr-2`,
                      subtask.is_completed
                        ? tw`bg-green-500`
                        : tw`bg-transparent`,
                    ]}
                  />
                  <Text
                    style={[
                      tw`text-black dark:text-white`,
                      subtask.is_completed && tw`line-through text-gray-500`,
                    ]}
                  >
                    {subtask.description}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <Text style={tw`text-xs text-gray-500 dark:text-gray-400 mt-2`}>
        Created at: {task.created_at}
      </Text>
      <Text style={tw`text-xs text-gray-500 dark:text-gray-400 mt-2`}>
        Updated at: {task.updated_at}
      </Text>
    </SafeAreaView>
  );
}
