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

export const TaskList = () => {
  const { tasks, getTasks, setTasks } = useTasks();
  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = await getTasks();
        setDisplayTasks(storedTasks);

        if (storedTasks.length === 0) {
          const apiTasks = await taskService.getTasksApi();
          await setTasks(apiTasks);
          setDisplayTasks(apiTasks);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const apiTasks = await taskService.getTasksApi();
      await setTasks(apiTasks);
      setDisplayTasks(apiTasks);
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
    <View style={tw`flex-1`}>
      <ScrollView
        style={tw`flex-1`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {displayTasks.map((item) => (
          <View key={`task-${item.id}`} style={tw`mb-4 p-4`}>
            <TouchableOpacity onPress={() => router.push(`/tasks/${item.id}`)}>
              <Text style={tw`text-black dark:text-white font-bold`}>
                {item.id}
              </Text>
              <Text style={tw`text-black dark:text-white `}>
                {item.description}
              </Text>
              <Text style={tw`text-black dark:text-white `}>
                {item.created_at}
              </Text>
              <Text style={tw`text-black dark:text-white `}>
                {item.is_completed}
              </Text>
              <Text style={tw`text-black dark:text-white `}>
                {item.updated_at}
              </Text>
              {item.subtasks.map((subtask, index) => (
                <View
                  key={`task-${item.id}-subtask-${subtask.id || index}`}
                  style={tw`ml-4 mt-2`}
                >
                  <Text style={tw`text-black dark:text-white `}>
                    {subtask.id}
                  </Text>
                  <Text style={tw`text-black dark:text-white `}>
                    {subtask.description}
                  </Text>
                  <Text style={tw`text-black dark:text-white `}>
                    {subtask.is_completed}
                  </Text>
                </View>
              ))}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={tw`absolute bottom-6 right-6`}>
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
