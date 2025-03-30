import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { Note } from "@/types/note.types";

export const noteService = {
  async getNotesApi(): Promise<Note[]> {
    return apiClient.get<Note[]>(ENDPOINTS.notes.list);
  },
};
