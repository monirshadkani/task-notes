//Composant de liste des notes
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import { useState, useEffect } from "react";
import { useNotes } from "@/contexts/NotesContext";
import { Note } from "@/types/note.types";
import { noteService } from "@/services/notes/noteService";

export const NoteList = () => {
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

  return (
    <FlashList
      data={displayNotes}
      renderItem={({ item }: { item: Note }) => (
        <View>
          <Text style={tw`text-black dark:text-white font-bold`}>
            {item.id}
          </Text>
          <Text style={tw`text-black dark:text-white font-bold`}>
            {item.title}
          </Text>
          <Text style={tw`text-black dark:text-white font-bold`}>
            {item.content}
          </Text>
          <Text style={tw`text-black dark:text-white font-bold`}>
            {item.created_at}
          </Text>
          <Text style={tw`text-black dark:text-white font-bold`}>
            {item.updated_at}
          </Text>
        </View>
      )}
      //estimatedItemSize={200}
    />
  );
};
