//Page d'édition de note
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
import { router, useLocalSearchParams } from "expo-router";
import { useCategories } from "@/contexts/CategoriesContect";
import { Category } from "@/types/category.types";
import { useNotes } from "@/contexts/NotesContext";
import { IconSymbol } from "@/components/ui/IconSymbol";

const DEFAULT_CATEGORY_COLOR = "#9CA3AF";

export default function EditNote() {
  const noteId = useLocalSearchParams().id;
  const { notes, updateNote, deleteNote } = useNotes();
  const { categories } = useCategories();
  const [note, setNote] = useState<Note | null>(null);
  const [editedNote, setEditedNote] = useState<Partial<Note>>({});
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    const foundNote = notes.find((n) => n.id === Number(noteId));
    if (foundNote) {
      setNote(foundNote);
      setEditedNote({
        title: foundNote.title,
        content: foundNote.content,
        categories: foundNote.categories,
      });
      setSelectedCategories(foundNote.categories || []);
    }
  }, [noteId, notes]);

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

  const handleSubmit = async () => {
    try {
      if (!note) return;

      const updatedNote = {
        title: editedNote.title,
        content: editedNote.content,
        categories: selectedCategories.map((category) => ({
          ...category,
          pivot: {
            note_id: note.id,
            category_id: category.id,
          },
        })),
      };

      await updateNote(note.id.toString(), updatedNote);
      router.back();
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    try {
      await deleteNote(note.id.toString());
      router.back();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  if (!note) {
    return (
      <SafeAreaView style={tw`flex-1 p-4 bg-white dark:bg-gray-900`}>
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View
        style={tw`flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700`}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={tw`text-blue-500 text-base`}>Cancel</Text>
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          Edit Note
        </Text>
        <View style={tw`flex-row gap-4`}>
          <TouchableOpacity onPress={handleDelete}>
            <IconSymbol name="trash" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={tw`text-blue-500 text-base`}>Save</Text>
          </TouchableOpacity>
        </View>
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
            onChangeText={(text) =>
              setEditedNote((prev) => ({ ...prev, title: text }))
            }
            value={editedNote.title}
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
            onChangeText={(text) =>
              setEditedNote((prev) => ({ ...prev, content: text }))
            }
            value={editedNote.content}
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
                    {
                      backgroundColor: category.color || DEFAULT_CATEGORY_COLOR,
                    },
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
