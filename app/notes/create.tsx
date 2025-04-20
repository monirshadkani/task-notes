// Page de création de note

import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import tw from "twrnc";
import { Note } from "@/types/note.types";
import { noteService } from "@/services/notes/noteService";
import { router } from "expo-router";
import { useCategories } from "@/contexts/CategoriesContect";
import { Category } from "@/types/category.types";
import { useNotes } from "@/contexts/NotesContext";
import { useDebounce } from "@/hooks/useDebounce";

type CreateNotePayload = {
  title: string;
  content: string;
  categories: number[];
};

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const { categories } = useCategories();
  const { refreshNotes } = useNotes();

  const handleTitleChange = (text: string) => {
    setTitle(text);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
  };

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.some((c) => c.id === category.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== category.id);
      } else {
        return [...prev, category];
      }
    });
  };

  const debouncedSubmit = useDebounce(async () => {
    try {
      const newNote: CreateNotePayload = {
        title: title,
        content: content,
        categories: selectedCategories.map((category) => category.id),
      };

      await noteService.setNotesApi(newNote as unknown as Note);
      await refreshNotes();
      setTitle("");
      setContent("");
      setSelectedCategories([]);
      router.replace("/");
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  }, 500);

  const handleSubmit = () => {
    debouncedSubmit();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View
        style={tw`flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700`}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={tw`text-blue-500 text-base`}>Cancel</Text>
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          Create Note
        </Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={tw`text-blue-500 text-base`}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4`}
        keyboardShouldPersistTaps="handled"
      >
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

        <View style={tw`mb-6`}>
          <Text
            style={tw`text-sm font-medium mb-2 text-gray-700 dark:text-gray-300`}
          >
            Categories
          </Text>
          <View style={tw`flex-row flex-wrap gap-2`}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => toggleCategory(category)}
                style={[
                  tw`flex-row items-center px-3 py-2 rounded-lg`,
                  selectedCategories.some((c) => c.id === category.id)
                    ? tw`bg-blue-100 dark:bg-blue-900`
                    : tw`bg-gray-100 dark:bg-gray-800`,
                ]}
              >
                <View
                  style={[
                    tw`w-3 h-3 rounded-full mr-2`,
                    { backgroundColor: category.color },
                  ]}
                />
                <Text
                  style={[
                    tw`text-sm`,
                    selectedCategories.some((c) => c.id === category.id)
                      ? tw`text-blue-700 dark:text-blue-300`
                      : tw`text-gray-700 dark:text-gray-300`,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
