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
    <SafeAreaView style={tw`flex-1 p-4 bg-white dark:bg-gray-900`}>
      <Text style={tw`text-xl font-bold text-black dark:text-white`}>
        {note?.title}
      </Text>
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
          style={tw`bg-red-500 p-4 rounded-lg mt-4 flex-row justify-center items-center`}
        >
          <Text style={tw`text-white text-lg font-bold`}>Delete</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
