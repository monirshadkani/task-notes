//Page d'édition de note
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import tw from "twrnc";
import { useNotes } from "@/contexts/NotesContext";
import { Note } from "@/types/note.types";
import { noteService } from "@/services/notes/noteService";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { router } from "expo-router";

export default function NoteEdit() {
  const noteId = useLocalSearchParams().id;
  const { getNotes } = useNotes();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    getNotes()
      .then((notes) => {
        const foundNote = notes.find(
          (note: Note) => note.id === Number(noteId)
        );
        setNote(foundNote as Note);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  }, [getNotes, noteId]);

  const handleDeleteNote = async () => {
    try {
      if (note) {
        await noteService.deleteNoteApi(noteId as string);

        //const apiNotes = await noteService.getNotesApi();

        router.back();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <SafeAreaView
      style={tw`flex-1 p-4 bg-white dark:bg-gray-900 border items-center border-red-500`}
    >
      <View
        style={tw` justify-between items-center border border-blue-500 w-[50%] h-[90%]`}
      >
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          {note?.title}
        </Text>

        {note?.categories && note.categories.length > 0 && (
          <View style={tw`flex-row flex-wrap mt-2`}>
            {note.categories.map((category) => (
              <View
                key={category.id}
                style={tw`flex-row items-center mr-2 mb-1`}
              >
                <View
                  style={[
                    tw`w-3 h-3 rounded-full mr-1`,
                    { backgroundColor: category.color },
                  ]}
                />
                <Text style={tw`text-sm text-gray-700 dark:text-gray-300`}>
                  {category.name}
                </Text>
              </View>
            ))}
          </View>
        )}

        <ScrollView style={tw`mt-4`}>
          {note?.content ? (
            <Text
              style={tw`text-gray-700 dark:text-gray-300 text-base leading-6`}
            >
              {note.content}
            </Text>
          ) : (
            <Text style={tw`text-gray-500 dark:text-gray-400`}>No content</Text>
          )}
        </ScrollView>
        <View style={tw`mt-4`}>
          <Text style={tw`text-xs text-gray-500 dark:text-gray-400`}>
            Created at: {note?.created_at}
          </Text>
          <Text style={tw`text-xs text-gray-500 dark:text-gray-400 mt-2`}>
            Updated at: {note?.updated_at}
          </Text>
        </View>

        <TouchableOpacity onPress={handleDeleteNote}>
          <View
            style={tw`bg-red-500 p-4 rounded-lg mt-4 flex-row w-40 justify-center items-center`}
          >
            <Text style={tw`text-white text-lg font-bold `}>Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
