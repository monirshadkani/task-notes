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
import React from "react";
import { router } from "expo-router";
import { IconSymbol } from "../ui/IconSymbol";
import { FlashList } from "@shopify/flash-list";

export const TaskList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { tasks, refreshTasks } = useTasks();

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
              style={tw`bg-white dark:bg-blue-900 m-2 p-4 rounded-lg border border-gray-100 dark:border-blue-800`}
              onPress={() => router.push(`/tasks/${item.id}`)}
            >
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-black dark:text-white font-bold`}>
                  {item.description}
                </Text>
                <View
                  style={[
                    tw`w-4 h-4 rounded-full`,
                    item.is_completed
                      ? tw`bg-green-500`
                      : tw`bg-gray-300 dark:bg-gray-700`,
                  ]}
                />
              </View>

              {item.subtasks && item.subtasks.length > 0 && (
                <Text
                  style={tw`text-gray-700 dark:text-gray-300 text-sm mt-2`}
                  numberOfLines={2}
                >
                  Subtasks: {item.subtasks.length}
                </Text>
              )}

              <Text style={tw`text-xs text-gray-500 dark:text-gray-400 mt-2`}>
                Created: {new Date(item.created_at).toLocaleDateString()}
              </Text>
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
