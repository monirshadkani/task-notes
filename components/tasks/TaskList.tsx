//Composant de liste des tâches
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import { useState, useEffect } from "react";
import { Task } from "@/types/task.types";
import { taskService } from "@/services/tasks/taskService";
import { useTasks } from "@/contexts/TasksContext";
import { noteService } from "@/services/notes/noteService";

export const TaskList = () => {
  const { tasks, getTasks, setTasks } = useTasks();
  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);

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

  return (
    <FlashList
      data={displayTasks}
      renderItem={({ item }: { item: Task }) => (
        <View>
          <Text style={tw`text-black dark:text-white font-bold`}>
            {item.id}
          </Text>
          <Text style={tw`text-black dark:text-white font-bold`}>
            {item.description}
          </Text>
          <Text style={tw`text-black dark:text-white font-bold`}>
            {item.created_at}
          </Text>
          <Text style={tw`text-black dark:text-white font-bold`}>
            {item.is_completed}
          </Text>
          <Text style={tw`text-black dark:text-white font-bold`}>
            {item.updated_at}
          </Text>
          {item.subtasks.map((subtask) => (
            <View>
              <Text style={tw`text-black dark:text-white font-bold`}>
                {subtask.id}
              </Text>
              <Text style={tw`text-black dark:text-white font-bold`}>
                {subtask.description}
              </Text>
              <Text style={tw`text-black dark:text-white font-bold`}>
                {subtask.is_completed}
              </Text>
            </View>
          ))}
        </View>
      )}
    />
  );
};
