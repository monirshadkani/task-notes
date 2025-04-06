//temporary note create page
import React, { useState } from "react";
import { View, TextInput, Button, Text, ScrollView } from "react-native";
import tw from "twrnc";
import { Note } from "@/types";
import { noteService } from "@/services/notes/noteService";

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
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-2xl font-bold mb-6 text-black dark:text-white`}>
          Create a Note
        </Text>

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

        <Button title="Create Note" onPress={handleSubmit} color="#0284c7" />
      </View>
    </ScrollView>
  );
}
