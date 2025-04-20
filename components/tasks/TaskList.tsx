//Composant de liste des tâches
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import { useState, useEffect } from "react";
import { Task } from "@/types/task.types";
import { taskService } from "@/services/tasks/taskService";
import { useTasks } from "@/contexts/TasksContext";
import { useNotes } from "@/contexts/NotesContext";
import React from "react";
import { router } from "expo-router";
import { IconSymbol } from "../ui/IconSymbol";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export const TaskList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { tasks, refreshTasks, toggleTask } = useTasks();
  const { notes } = useNotes();
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshTasks();
    } catch (error) {
      console.error("Failed to refresh tasks:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToCreate = () => {
    router.push("/tasks/create");
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask(taskId);
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const getNoteColor = (noteId: number) => {
    const note = notes.find((n) => n.id === noteId);
    return note?.categories?.[0]?.color || "#9CA3AF";
  };

  return (
    <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          Tasks
        </Text>
      </View>
      <View style={tw`flex-1`}>
        <FlashList
          data={tasks}
          renderItem={({ item }: { item: Task }) => (
            <TouchableOpacity
              style={[
                tw`m-2 p-4 rounded-lg`,
                item.is_completed
                  ? tw`bg-gray-50 dark:bg-gray-800/50`
                  : tw`bg-white dark:bg-gray-800`,
                tw`border border-gray-200 dark:border-gray-700`,
              ]}
              onPress={() => router.push(`/tasks/${item.id}`)}
            >
              <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row items-center`}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleTask(item.id.toString());
                      }}
                      style={tw`mr-3`}
                    >
                      <View
                        style={[
                          tw`w-6 h-6 rounded-full border-2 items-center justify-center`,
                          item.is_completed
                            ? tw`border-green-500 bg-green-500`
                            : tw`border-gray-300 dark:border-gray-600`,
                        ]}
                      >
                        {item.is_completed && (
                          <IconSymbol
                            name="checkmark"
                            size={16}
                            color="white"
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text
                      style={[
                        tw`text-lg font-medium`,
                        item.is_completed
                          ? tw`text-gray-500 dark:text-gray-400`
                          : tw`text-black dark:text-white`,
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                  {item.note_id && (
                    <View style={tw`flex-row items-center mt-1 ml-9`}>
                      <View
                        style={[
                          tw`w-3 h-3 rounded-full mr-2`,
                          { backgroundColor: getNoteColor(item.note_id) },
                        ]}
                      />
                      <Text
                        style={[
                          tw`text-xs`,
                          item.is_completed
                            ? tw`text-gray-400 dark:text-gray-500`
                            : tw`text-gray-500 dark:text-gray-400`,
                        ]}
                      >
                        {notes.find((n) => n.id === item.note_id)?.title}
                      </Text>
                    </View>
                  )}
                  {item.subtasks && item.subtasks.length > 0 && (
                    <View style={tw`mt-2 ml-9`}>
                      <View style={tw`flex-row items-center mb-1`}>
                        <View
                          style={tw`h-1 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full mr-2`}
                        >
                          <View
                            style={[
                              tw`h-1 bg-green-500 rounded-full`,
                              {
                                width: `${
                                  (item.subtasks.filter((st) => st.is_completed)
                                    .length /
                                    item.subtasks.length) *
                                  100
                                }%`,
                              },
                            ]}
                          />
                        </View>
                        <Text
                          style={tw`text-xs text-gray-500 dark:text-gray-400`}
                        >
                          {item.subtasks.filter((st) => st.is_completed).length}
                          /{item.subtasks.length}
                        </Text>
                      </View>
                      {item.subtasks.slice(0, 2).map((subtask, index) => (
                        <View
                          key={`subtask-${item.id}-${subtask.id || index}`}
                          style={tw`flex-row items-center mb-1`}
                        >
                          <View
                            key={`subtask-indicator-${item.id}-${
                              subtask.id || index
                            }`}
                            style={[
                              tw`w-3 h-3 rounded-full mr-2`,
                              subtask.is_completed
                                ? tw`bg-green-500`
                                : tw`bg-gray-300 dark:bg-gray-600`,
                            ]}
                          />
                          <Text
                            key={`subtask-text-${item.id}-${
                              subtask.id || index
                            }`}
                            style={[
                              tw`text-sm`,
                              subtask.is_completed
                                ? tw`text-gray-500 dark:text-gray-400`
                                : tw`text-gray-700 dark:text-gray-300`,
                            ]}
                          >
                            {subtask.description}
                          </Text>
                        </View>
                      ))}
                      {item.subtasks.length > 2 && (
                        <Text
                          key={`more-subtasks-${item.id}`}
                          style={tw`text-xs text-gray-500 dark:text-gray-400 mt-1`}
                        >
                          +{item.subtasks.length - 2} more subtasks
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      <View style={tw`absolute bottom-15 right-6`}>
        <TouchableOpacity
          onPress={navigateToCreate}
          style={tw`bg-blue-500 p-4 rounded-full shadow-lg`}
        >
          <IconSymbol name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
