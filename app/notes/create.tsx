// Page de création de note
//temporary note create page
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import { Note } from "@/types";
import { noteService } from "@/services/notes/noteService";
import { router } from "expo-router";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTitleChange = (text: string) => {
    setTitle(text);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
  };

  const handleSubmit = async () => {
    try {
      const newNote: Partial<Note> = {
        title: title,
        content: content,
      };

      await noteService.setNotesApi(newNote as Note);
      setTitle("");
      setContent("");
      router.back();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  return (
    <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View
        style={tw`flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700`}
      >
        <TouchableOpacity style={tw`mr-4`}></TouchableOpacity>
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          Create a Note
        </Text>
      </View>
      <ScrollView style={tw`flex-1 p-4`}>
        <View style={tw`mb-4`}>
          <Text
            style={tw`text-sm font-medium mb-2 text-gray-700 dark:text-gray-300`}
          >
            Title
          </Text>
          <TextInput
            style={tw`w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white`}
            onChangeText={handleTitleChange}
            value={title}
            placeholder="Enter title"
            placeholderTextColor="#666"
          />
        </View>

        <View style={tw`mb-6`}>
          <Text
            style={tw`text-sm font-medium mb-2 text-gray-700 dark:text-gray-300`}
          >
            Content
          </Text>
          <TextInput
            style={tw`w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white min-h-[200px]`}
            onChangeText={handleContentChange}
            value={content}
            placeholder="Enter content"
            placeholderTextColor="#666"
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={tw`bg-blue-500 p-4 rounded-lg items-center`}
          onPress={handleSubmit}
        >
          <Text style={tw`text-white font-bold`}>Create Note</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
