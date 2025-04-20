import { createContext, useContext, useState, useEffect } from "react";

import { Note } from "@/types/note.types";
import { storageService } from "@/services/storage/asyncStorage";
import { noteService } from "@/services/notes/noteService";

type NotesContextType = {
  notes: Note[];
  setNotes: (notes: Note[]) => Promise<void>;
  getNotes: () => Promise<Note[]>;
  refreshNotes: () => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
};

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  setNotes: async () => {},
  getNotes: async () => [],
  refreshNotes: async () => {},
  deleteNote: async () => {},
});

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotesState] = useState<Note[]>([]);

  const refreshNotes = async () => {
    try {
      const apiNotes = await noteService.getNotesApi();
      await storageService.setNotesStorage(apiNotes);
      setNotesState(apiNotes);
    } catch (error) {
      console.error("Failed to refresh notes:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await noteService.deleteNoteApi(id);
      const updatedNotes = notes.filter((note) => note.id.toString() !== id);
      await storageService.setNotesStorage(updatedNotes);
      setNotesState(updatedNotes);
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const storedNotes = await storageService.getNotesStorage();
        if (storedNotes.length === 0) {
          await refreshNotes();
        } else {
          setNotesState(storedNotes);
        }
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };
    fetchNotes();
  }, []);

  const setNotes = async (notes: Note[]) => {
    await storageService.setNotesStorage(notes);
    setNotesState(notes);
  };

  const getNotes = async () => {
    return storageService.getNotesStorage();
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        getNotes,
        refreshNotes,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
