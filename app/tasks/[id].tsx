// Page d'édition de tâche
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import tw from "twrnc";
import { useTasks } from "@/contexts/TasksContext";
import { Task } from "@/types/task.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

export default function TaskEdit() {
  const taskId = useLocalSearchParams().id;
  const { getTasks } = useTasks();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    getTasks()
      .then((tasks) => {
        const foundTask = tasks.find(
          (task: Task) => task.id === Number(taskId)
        );
        setTask(foundTask as Task);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [getTasks, taskId]);

  return (
    <SafeAreaView style={tw`flex-1 p-4 bg-white dark:bg-gray-900`}>
      <View>
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          Task Details
        </Text>
        <Text
          style={tw`text-xs text-gray-500 dark:text-gray-400 mt-2 font-bold`}
        >
          {task?.description}
        </Text>
        <Text style={tw`text-xs text-gray-500 dark:text-gray-400 mt-2`}>
          Created at: {task?.created_at}
        </Text>
        <Text style={tw`text-xs text-gray-500 dark:text-gray-400 mt-2`}>
          Updated at: {task?.updated_at}
        </Text>
        {task?.subtasks && task.subtasks.length > 0 && (
          <View style={tw`mt-2`}>
            <Text
              style={tw`text-xs text-gray-500 dark:text-gray-400 font-bold`}
            >
              Subtasks:
            </Text>
            {task.subtasks.map((subtask, index) => (
              <Text
                key={`${subtask.id}-${subtask.description}`}
                style={tw`text-xs text-gray-500 dark:text-gray-400 mt-1 ml-2`}
              >
                {index + 1}. {subtask.description}
              </Text>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
