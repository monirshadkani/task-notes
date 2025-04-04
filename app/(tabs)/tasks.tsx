// Écran principal des tâches
//Écran principal des notes
import {
  StyleSheet,
  Image,
  Platform,
  Button,
  View,
  Text,
  StatusBar,
} from "react-native";
import React from "react";
import { useAuth } from "../_layout";
import { TaskList } from "@/components/tasks/TaskList";
import tw from "twrnc";

export default function Tasks() {
  return (
    <View>
      <Text style={tw`text-black dark:text-white font-bold`}>Tasks</Text>
      <TaskList />
    </View>
  );
}
