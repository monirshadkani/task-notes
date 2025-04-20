//Composant de liste des notes
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ScrollView,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import { useState, useEffect } from "react";
import { useNotes } from "@/contexts/NotesContext";
import { Note } from "@/types/note.types";
import { noteService } from "@/services/notes/noteService";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryList } from "../categories/CategoryList";
import { useCategories } from "@/contexts/CategoriesContect";
import { useTheme } from "@/contexts/ThemeContext";

const DEFAULT_CATEGORY_COLOR = "#9CA3AF";

const getContrastColor = (hexColor: string): string => {
  const color = hexColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "#000000" : "#ffffff";
};

export const NoteList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { notes, refreshNotes } = useNotes();
  const { categories } = useCategories();
  const { isDarkMode } = useTheme();

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshNotes();
    } catch (error) {
      console.error("Failed to refresh notes:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToCreate = () => {
    router.push("/notes/create");
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = searchQuery
      ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory = selectedCategory
      ? note.categories.some((category) => category.id === selectedCategory)
      : true;

    return matchesSearch && matchesCategory;
  });

  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View style={tw`p-4`}>
        <TextInput
          style={tw`mt-2 p-2 border rounded-lg text-black dark:text-white border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800`}
          placeholder="Search notes..."
          placeholderTextColor={isDarkMode ? "#666" : "#999"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={tw`px-4 py-2 bg-white dark:bg-gray-900`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategoryPress(category.id)}
              style={[
                tw`flex-row items-center mr-4 px-3 py-2 rounded-lg`,
                selectedCategory === category.id
                  ? tw`bg-blue-100 dark:bg-blue-900`
                  : tw`bg-gray-100 dark:bg-gray-800`,
              ]}
            >
              <Text
                style={[
                  tw`text-sm font-medium mr-2`,
                  selectedCategory === category.id
                    ? tw`text-blue-700 dark:text-blue-300`
                    : tw`text-gray-800 dark:text-white`,
                ]}
              >
                {category.name}
              </Text>
              <View
                style={[
                  tw`w-3 h-3 rounded-full`,
                  { backgroundColor: category.color || DEFAULT_CATEGORY_COLOR },
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={tw`flex-1 min-h-[200px]`}>
        <FlashList
          data={filteredNotes}
          numColumns={2}
          renderItem={({ item }: { item: Note }) => {
            const firstCategory = item.categories[0];
            const backgroundColor =
              firstCategory?.color || DEFAULT_CATEGORY_COLOR;
            const textColor = getContrastColor(backgroundColor);

            return (
              <TouchableOpacity
                style={[
                  tw`w-50 m-2 h-40 border-2 p-2 rounded-lg`,
                  {
                    backgroundColor,
                    borderColor: backgroundColor,
                  },
                ]}
                onPress={() => router.push(`/notes/${item.id}`)}
              >
                <Text
                  style={[tw`font-bold`, { color: textColor }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text
                  style={[tw`text-sm mt-2`, { color: textColor }]}
                  numberOfLines={3}
                >
                  {item.content}
                </Text>

                {item.categories && item.categories.length > 0 && (
                  <View style={tw`flex-row flex-wrap mt-2`}>
                    {item.categories.map((category) => (
                      <View
                        key={category.id}
                        style={tw`flex-row items-center mr-2 mb-1`}
                      >
                        <View
                          style={[
                            tw`w-2 h-2 rounded-full mr-1 border`,
                            {
                              backgroundColor:
                                category.color || DEFAULT_CATEGORY_COLOR,
                              borderColor: textColor,
                              borderWidth: 1,
                            },
                          ]}
                        />
                        <Text style={[tw`text-xs`, { color: textColor }]}>
                          {category.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={[tw`text-xs mt-2`, { color: textColor }]}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            );
          }}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      <View style={tw`absolute bottom-3 right-6`}>
        <TouchableOpacity
          onPress={navigateToCreate}
          style={tw`bg-blue-500 p-4 rounded-full`}
        >
          <IconSymbol name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
