//Composant de liste des tâches
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import tw from "twrnc";
import { useState, useEffect } from "react";
import { Task } from "@/types/task.types";
import { useTasks } from "@/contexts/TasksContext";
import { useNotes } from "@/contexts/NotesContext";
import React from "react";
import { IconSymbol } from "../ui/IconSymbol";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

export const TaskList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState<boolean | null>(null);
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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = searchQuery
      ? task.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCompletion =
      showCompleted === null ? true : task.is_completed === showCompleted;

    return matchesSearch && matchesCompletion;
  });

  return (
    <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View style={tw`p-4`}>
        <TextInput
          style={tw`mt-2 p-2 border rounded-lg text-black dark:text-white border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800`}
          placeholder="Search tasks..."
          placeholderTextColor={isDarkMode ? "#666" : "#999"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={tw`flex-row mt-2`}>
          <TouchableOpacity
            onPress={() => setShowCompleted(null)}
            style={[
              tw`px-3 py-2 rounded-lg mr-2`,
              showCompleted === null
                ? tw`bg-blue-500`
                : tw`bg-gray-200 dark:bg-gray-700`,
            ]}
          >
            <Text
              style={[
                tw`text-sm`,
                showCompleted === null
                  ? tw`text-white`
                  : tw`text-gray-700 dark:text-gray-300`,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowCompleted(false)}
            style={[
              tw`px-3 py-2 rounded-lg mr-2`,
              showCompleted === false
                ? tw`bg-blue-500`
                : tw`bg-gray-200 dark:bg-gray-700`,
            ]}
          >
            <Text
              style={[
                tw`text-sm`,
                showCompleted === false
                  ? tw`text-white`
                  : tw`text-gray-700 dark:text-gray-300`,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowCompleted(true)}
            style={[
              tw`px-3 py-2 rounded-lg`,
              showCompleted === true
                ? tw`bg-blue-500`
                : tw`bg-gray-200 dark:bg-gray-700`,
            ]}
          >
            <Text
              style={[
                tw`text-sm`,
                showCompleted === true
                  ? tw`text-white`
                  : tw`text-gray-700 dark:text-gray-300`,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`flex-1 min-h-[200px]`}>
        <FlashList
          data={filteredTasks}
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

      <View style={tw`absolute bottom-3 right-6`}>
        <TouchableOpacity
          onPress={navigateToCreate}
          style={tw`bg-blue-500 p-4 rounded-full`}
        >
          <IconSymbol name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
