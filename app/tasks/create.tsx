// Page de création de tâche
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import { Subtask, Task } from "@/types/task.types";
import { taskService } from "@/services/tasks/taskService";
import { router } from "expo-router";
import { Switch } from "react-native";

export default function TaskCreate() {
  const [description, setDescription] = useState("");
  const [is_completed, setIs_completed] = useState(false);
  const [subtask_description, setSubtask_description] = useState("");
  const [subtask_is_completed, setSubtask_is_completed] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const addSubtask = (
    subtask_description: string,
    subtask_is_completed: boolean = false
  ) => {
    const newSubtask: Partial<Subtask> = {
      description: subtask_description,
      is_completed: subtask_is_completed,
    };
    setSubtasks([...subtasks, newSubtask as Subtask]);
    setSubtask_description("");
    setSubtask_is_completed(false);
  };
  const deleteSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };
  const handleSubmit = async () => {
    try {
      const newTask: Partial<Task> = {
        description: description,
        is_completed: is_completed,
        subtasks: subtasks,
      };
      await taskService.setTaskApi(newTask as Task);
      setDescription("");
      setIs_completed(false);
      setSubtasks([]);
      router.back();
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-2xl font-bold`}>Create task</Text>
      <TextInput
        style={tw`border border-gray-300 rounded-md p-2 my-2`}
        placeholder="Task description"
        value={description}
        onChangeText={setDescription}
      />
      <Switch
        value={is_completed}
        onValueChange={() => setIs_completed(!is_completed)}
      />
      <View style={tw`flex-1`}>
        {subtasks.map((subtask, index) => (
          <View
            key={index}
            style={[
              tw`p-2 mb-2 rounded-md`,
              subtask.is_completed
                ? tw`bg-green-100 border-l-4 border-green-500`
                : tw`bg-gray-100 border-l-4 border-gray-300`,
            ]}
          >
            <View style={tw`flex-row justify-between items-center`}>
              <Text>{subtask.description}</Text>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-xs mr-2`}>
                  {subtask.is_completed ? "Completed" : "Not completed"}
                </Text>
                <TouchableOpacity
                  onPress={() => deleteSubtask(index)}
                  style={tw`w-6 h-6 bg-red-500 rounded-full items-center justify-center`}
                >
                  <Text style={tw`text-white text-sm`}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={tw`flex-1`}>
        <TextInput
          style={tw`border border-gray-300 rounded-md p-2 my-2`}
          placeholder="Subtask description"
          value={subtask_description}
          onChangeText={setSubtask_description}
        />
        <Switch
          value={subtask_is_completed}
          onValueChange={() => setSubtask_is_completed(!subtask_is_completed)}
        />
        <TouchableOpacity
          style={tw`bg-blue-500 p-2 rounded-md`}
          onPress={() => addSubtask(subtask_description, subtask_is_completed)}
        >
          <Text style={tw`text-white`}>Add subtask</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`flex-1`}>
        <TouchableOpacity
          style={tw`bg-blue-500 p-2 rounded-md`}
          onPress={handleSubmit}
        >
          <Text style={tw`text-white`}>Create task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
