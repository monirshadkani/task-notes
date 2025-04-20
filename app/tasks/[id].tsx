// Page d'édition de tâche
import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import tw from "twrnc";
import { useTasks } from "@/contexts/TasksContext";
import { useNotes } from "@/contexts/NotesContext";
import { Task, Subtask } from "@/types/task.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";

const DEFAULT_CATEGORY_COLOR = "#9CA3AF";

export default function TaskEdit() {
  const taskId = useLocalSearchParams().id;
  const { getTasks, deleteTask, updateTask } = useTasks();
  const { notes } = useNotes();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [newSubtask, setNewSubtask] = useState("");
  const [showNoteSelector, setShowNoteSelector] = useState(false);

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

  const handleCancel = () => {
    router.back();
  };

  const handleUpdate = async () => {
    try {
      const taskData = {
        description: editedTask.description,
        note_id: editedTask.note_id,
        is_completed: editedTask.is_completed,
        subtasks: editedTask.subtasks?.map((subtask) => ({
          description: subtask.description,
          is_completed: subtask.is_completed,
        })),
      };

      await updateTask(taskId as string, taskData);
      router.back();
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
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View
        style={tw`flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700`}
      >
        <TouchableOpacity onPress={handleCancel}>
          <Text style={tw`text-blue-500 text-base`}>Cancel</Text>
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          Task Details
        </Text>
        <View style={tw`flex-row gap-4`}>
          <TouchableOpacity onPress={handleDelete}>
            <IconSymbol name="trash" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUpdate}>
            <Text style={tw`text-blue-500 text-base`}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4`}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`mb-4`}>
          <Text
            style={tw`text-sm font-medium mb-2 text-gray-700 dark:text-gray-300`}
          >
            Status
          </Text>
          <View
            style={tw`flex-row items-center justify-between p-3 rounded-lg border border-gray-300 dark:border-gray-700`}
          >
            <Text style={tw`text-gray-700 dark:text-gray-300`}>
              {editedTask.is_completed ? "Completed" : "In Progress"}
            </Text>
            <Switch
              value={editedTask.is_completed}
              onValueChange={(value) =>
                setEditedTask((prev) => ({ ...prev, is_completed: value }))
              }
              trackColor={{ false: "#9CA3AF", true: "#10B981" }}
              thumbColor={editedTask.is_completed ? "#10B981" : "#F3F4F6"}
            />
          </View>
        </View>

        <View style={tw`mb-4`}>
          <Text
            style={tw`text-sm font-medium mb-2 text-gray-700 dark:text-gray-300`}
          >
            Description
          </Text>
          <TextInput
            style={tw`w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white`}
            value={editedTask.description}
            onChangeText={(text) =>
              setEditedTask((prev) => ({ ...prev, description: text }))
            }
            placeholder="Task description"
            placeholderTextColor="#666"
          />
        </View>

        {task.note && (
          <View style={tw`mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg`}>
            <View style={tw`flex-row items-center mb-2`}>
              <View
                style={[
                  tw`w-3 h-3 rounded-full mr-2`,
                  {
                    backgroundColor:
                      task.note.categories?.[0]?.color ||
                      DEFAULT_CATEGORY_COLOR,
                  },
                ]}
              />
              <Text
                style={tw`text-base font-medium text-gray-700 dark:text-gray-300`}
              >
                Associated Note
              </Text>
            </View>
            <Text style={tw`text-base text-gray-700 dark:text-gray-300`}>
              {task.note.title}
            </Text>
            <Text style={tw`text-sm text-gray-500 dark:text-gray-400 mt-1`}>
              {task.note.content}
            </Text>
          </View>
        )}

        <View style={tw`mb-4`}>
          <Text
            style={tw`text-sm font-medium mb-2 text-gray-700 dark:text-gray-300`}
          >
            Associated Note
          </Text>
          <TouchableOpacity
            onPress={() => setShowNoteSelector(!showNoteSelector)}
            style={tw`p-3 rounded-lg border border-gray-300 dark:border-gray-700`}
          >
            <View style={tw`flex-row items-center`}>
              {editedTask.note_id && (
                <View
                  style={[
                    tw`w-3 h-3 rounded-full mr-2`,
                    {
                      backgroundColor:
                        notes.find((n) => n.id === editedTask.note_id)
                          ?.categories?.[0]?.color || DEFAULT_CATEGORY_COLOR,
                    },
                  ]}
                />
              )}
              <Text style={tw`text-gray-700 dark:text-gray-300`}>
                {editedTask.note_id
                  ? notes.find((n) => n.id === editedTask.note_id)?.title ||
                    "Select a note"
                  : "Select a note"}
              </Text>
            </View>
          </TouchableOpacity>

          {showNoteSelector && (
            <View
              style={tw`mt-2 max-h-40 border border-gray-300 dark:border-gray-700 rounded-lg`}
            >
              <ScrollView>
                {notes.map((note) => (
                  <TouchableOpacity
                    key={note.id}
                    onPress={() => {
                      setEditedTask((prev) => ({
                        ...prev,
                        note_id: note.id,
                      }));
                      setShowNoteSelector(false);
                    }}
                    style={tw`p-3 border-b border-gray-200 dark:border-gray-700`}
                  >
                    <View style={tw`flex-row items-center`}>
                      <View
                        style={[
                          tw`w-3 h-3 rounded-full mr-2`,
                          {
                            backgroundColor:
                              note.categories?.[0]?.color ||
                              DEFAULT_CATEGORY_COLOR,
                          },
                        ]}
                      />
                      <Text style={tw`text-gray-700 dark:text-gray-300`}>
                        {note.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={tw`mb-4`}>
          <Text
            style={tw`text-sm font-medium mb-2 text-gray-700 dark:text-gray-300`}
          >
            Subtasks
          </Text>
          <View style={tw``}>
            {editedTask.subtasks?.map((subtask, index) => (
              <View
                key={index}
                style={tw`flex-row items-center justify-between p-3 rounded-lg border border-gray-300 dark:border-gray-700`}
              >
                <View style={tw`flex-row items-center flex-1`}>
                  <TouchableOpacity
                    onPress={() => handleToggleSubtask(index)}
                    style={tw`mr-3`}
                  >
                    <View
                      style={[
                        tw`w-5 h-5 rounded-full border-2 items-center justify-center`,
                        subtask.is_completed
                          ? tw`bg-green-500 border-green-500`
                          : tw`border-gray-300 dark:border-gray-600`,
                      ]}
                    >
                      {subtask.is_completed && (
                        <IconSymbol name="checkmark" size={12} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                  <Text
                    style={[
                      tw`flex-1`,
                      subtask.is_completed
                        ? tw`text-gray-400 dark:text-gray-500 line-through`
                        : tw`text-gray-700 dark:text-gray-300`,
                    ]}
                  >
                    {subtask.description}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteSubtask(index)}
                  style={tw`ml-2`}
                >
                  <IconSymbol name="trash" size={16} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={tw`flex-row mt-4`}>
            <TextInput
              style={tw`flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white`}
              value={newSubtask}
              onChangeText={setNewSubtask}
              placeholder="Add a subtask"
              placeholderTextColor="#666"
            />
            <TouchableOpacity
              onPress={handleAddSubtask}
              style={tw`ml-2 p-3 bg-blue-500 rounded-lg`}
            >
              <IconSymbol name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
