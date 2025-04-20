import { ApiResponse } from "@/types";
import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { Note } from "@/types/note.types";

export const noteService = {
  async getNotesApi(): Promise<Note[]> {
    return apiClient.get<Note[]>(ENDPOINTS.notes.list);
  },
  async setNotesApi(note: Note): Promise<void> {
    const payload = {
      title: note.title,
      content: note.content,
      categories: Array.isArray(note.categories)
        ? note.categories.map((category) =>
            typeof category === "number" ? category : category.id
          )
        : [],
    };

    console.log("Sending payload:", payload);
    await apiClient.post<ApiResponse<Note>>(ENDPOINTS.notes.create, payload);
  },
  async deleteNoteApi(noteId: string): Promise<void> {
    console.log("Deleting service:", noteId);
    await apiClient.delete(ENDPOINTS.notes.delete(noteId));
  },
};
