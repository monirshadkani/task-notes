// Écran principal des tâches
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { TaskList } from "@/components/tasks/TaskList";
import tw from "twrnc";

export default function Tasks() {
  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <TaskList />
    </SafeAreaView>
  );
}
