//Composant de liste des notes
import { View, Text, TouchableOpacity, RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import { useState, useEffect } from "react";
import { useNotes } from "@/contexts/NotesContext";
import { Note } from "@/types/note.types";
import { noteService } from "@/services/notes/noteService";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

export const NoteList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { notes, getNotes, setNotes } = useNotes();
  const [displayNotes, setDisplayNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const storedNotes = await getNotes();
        setDisplayNotes(storedNotes);

        if (storedNotes.length === 0) {
          const apiNotes = await noteService.getNotesApi();
          await setNotes(apiNotes);
          setDisplayNotes(apiNotes);
        }
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };
    fetchNotes();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const apiNotes = await noteService.getNotesApi();

      await setNotes(apiNotes);
      setDisplayNotes(apiNotes);

      console.log("Notes refreshed successfully:", apiNotes.length);
    } catch (error) {
      console.error("Failed to refresh notes:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToCreate = () => {
    router.push("/notes/create");
  };

  return (
    <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          Notes
        </Text>
      </View>

      <View style={tw`flex-1`}>
        <FlashList
          data={displayNotes}
          numColumns={2}
          renderItem={({ item }: { item: Note }) => (
            <TouchableOpacity
              style={tw`p-3 mb-2 mx-2 w-40 h-40 bg-white text-black border-2 rounded-lg truncate border-gray-100 dark:bg-blue-900 text-white border-blue-800`}
              onPress={() => router.push(`/notes/${item.id}`)}
            >
              <Text style={tw`text-lg font-bold text-black dark:text-white`}>
                {item.title}
              </Text>

              <Text
                style={tw`text-gray-700 dark:text-gray-300 text-sm mt-2`}
                numberOfLines={3}
              >
                {item.content}
              </Text>
              <Text style={tw`text-xs text-gray-500 dark:text-gray-400 mt-2`}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      <View style={tw`absolute bottom-5 right-5`}>
        <TouchableOpacity
          onPress={navigateToCreate}
          style={tw`bg-blue-500 p-4 rounded-full shadow-lg`}
        >
          <IconSymbol name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
