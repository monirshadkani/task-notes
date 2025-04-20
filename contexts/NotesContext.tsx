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
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
};

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  setNotes: async () => {},
  getNotes: async () => [],
  refreshNotes: async () => {},
  deleteNote: async () => {},
  updateNote: async () => {},
});

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotesState] = useState<Note[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeNotes = async () => {
      if (isInitialized) return;

      try {
        const storedNotes = await storageService.getNotesStorage();
        if (storedNotes && storedNotes.length > 0) {
          setNotesState(storedNotes);
        } else {
          const apiNotes = await noteService.getNotesApi();
          if (apiNotes && apiNotes.length > 0) {
            await storageService.setNotesStorage(apiNotes);
            setNotesState(apiNotes);
          }
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize notes:", error);
        setNotesState([]);
        setIsInitialized(true);
      }
    };

    initializeNotes();
  }, [isInitialized]);

  const refreshNotes = async () => {
    try {
      const apiNotes = await noteService.getNotesApi();
      if (apiNotes && apiNotes.length > 0) {
        await storageService.setNotesStorage(apiNotes);
        setNotesState(apiNotes);
      } else {
        setNotesState([]);
      }
    } catch (error) {
      console.error("Failed to refresh notes:", error);
      setNotesState([]);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const updatedNotes = notes.filter((note) => note.id.toString() !== id);
      await storageService.setNotesStorage(updatedNotes);
      setNotesState(updatedNotes);

      noteService.deleteNoteApi(id).catch((error) => {
        console.error("Failed to sync delete with API:", error);
      });
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    }
  };

  const updateNote = async (id: string, note: Partial<Note>) => {
    try {
      const updatedNotes = notes.map((n) =>
        n.id.toString() === id ? { ...n, ...note } : n
      );
      await storageService.setNotesStorage(updatedNotes);
      setNotesState(updatedNotes);

      noteService.updateNoteApi(id, note).catch((error) => {
        console.error("Failed to sync update with API:", error);
      });
    } catch (error) {
      console.error("Failed to update note:", error);
      throw error;
    }
  };

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
        updateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
