import { ApiResponse } from "@/types";
import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { Note } from "@/types/note.types";

export const noteService = {
  async getNotesApi(): Promise<Note[]> {
    return apiClient.get<Note[]>(ENDPOINTS.notes.list);
  },
  async setNotesApi(note: Note): Promise<void> {
    apiClient.post<ApiResponse<Note>>(ENDPOINTS.notes.create, {
      title: note.title,
      content: note.content,
    });
  },
  async deleteNoteApi(noteId: string): Promise<void> {
    apiClient.delete(ENDPOINTS.notes.delete(noteId));
  },
};
