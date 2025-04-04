import { createContext, useContext, useState } from "react";

import { Note } from "@/types/note.types";
import { Category } from "@/types/category.types";
import { storageService } from "@/services/storage/asyncStorage";

type NotesContextType = {
  notes: Note[];
  //categories: Category[];
  setNotes: (notes: Note[]) => Promise<void>;
  getNotes: () => Promise<Note[]>;
};

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  //categories: [],
  setNotes: async () => {},
  getNotes: async () => [],
});

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotesState] = useState<Note[]>([]);
  //const [categories, setCategories] = useState<Category[]>([]);

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
        //categories,
        setNotes,
        getNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
