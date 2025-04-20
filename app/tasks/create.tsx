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
import { useNotes } from "@/contexts/NotesContext";
import { Note } from "@/types/note.types";

export default function TaskCreate() {
  const [description, setDescription] = useState("");
  const [is_completed, setIs_completed] = useState(false);
  const [subtask_description, setSubtask_description] = useState("");
  const [subtask_is_completed, setSubtask_is_completed] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { notes } = useNotes();

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
        note_id: selectedNote?.id,
      };
      await taskService.setTaskApi(newTask as Task);
      setDescription("");
      setIs_completed(false);
      setSubtasks([]);
      setSelectedNote(null);
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
      <View style={tw`flex-row items-center mb-2`}>
        <Text style={tw`mr-2`}>Completed:</Text>
        <Switch
          value={is_completed}
          onValueChange={() => setIs_completed(!is_completed)}
        />
      </View>

      <View style={tw`mb-6`}>
        <Text
          style={tw`text-sm font-medium mb-2 text-gray-700 dark:text-gray-300`}
        >
          Select a Note (Optional)
        </Text>
        <View style={tw`space-y-2`}>
          {notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              onPress={() => setSelectedNote(note)}
              style={[
                tw`p-3 rounded-lg border`,
                selectedNote?.id === note.id
                  ? tw`border-blue-500 bg-blue-50 dark:bg-blue-900/20`
                  : tw`border-gray-200 dark:border-gray-700`,
              ]}
            >
              <View style={tw`flex-row items-center`}>
                <View
                  style={[
                    tw`w-3 h-3 rounded-full mr-2`,
                    { backgroundColor: note.categories[0]?.color || "#9CA3AF" },
                  ]}
                />
                <Text
                  style={[
                    tw`text-sm`,
                    selectedNote?.id === note.id
                      ? tw`text-blue-700 dark:text-blue-300`
                      : tw`text-gray-700 dark:text-gray-300`,
                  ]}
                >
                  {note.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-medium mb-2`}>Subtasks</Text>
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

      <View style={tw`mb-4`}>
        <TextInput
          style={tw`border border-gray-300 rounded-md p-2 my-2`}
          placeholder="Subtask description"
          value={subtask_description}
          onChangeText={setSubtask_description}
        />
        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`mr-2`}>Completed:</Text>
          <Switch
            value={subtask_is_completed}
            onValueChange={() => setSubtask_is_completed(!subtask_is_completed)}
          />
        </View>
        <TouchableOpacity
          style={tw`bg-blue-500 p-2 rounded-md`}
          onPress={() => addSubtask(subtask_description, subtask_is_completed)}
        >
          <Text style={tw`text-white`}>Add subtask</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={tw`bg-blue-500 p-2 rounded-md`}
        onPress={handleSubmit}
      >
        <Text style={tw`text-white`}>Create task</Text>
      </TouchableOpacity>
    </View>
  );
}
