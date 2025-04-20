import { ApiResponse } from "@/types";
import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { Note } from "@/types/note.types";

export const noteService = {
  async getNotesApi(): Promise<Note[]> {
    try {
      const response = await apiClient.get<Note[]>(ENDPOINTS.notes.list);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      return [];
    }
  },

  async getNoteApi(id: string): Promise<Note> {
    return apiClient.get<Note>(ENDPOINTS.notes.get(id));
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

  async updateNoteApi(id: string, note: Partial<Note>): Promise<void> {
    const payload = {
      title: note.title,
      content: note.content,
      categories: Array.isArray(note.categories)
        ? note.categories.map((category) =>
            typeof category === "number" ? category : category.id
          )
        : [],
    };

    await apiClient.put<ApiResponse<Note>>(ENDPOINTS.notes.update(id), payload);
  },

  async deleteNoteApi(noteId: string): Promise<void> {
    console.log("Deleting service:", noteId);
    await apiClient.delete(ENDPOINTS.notes.delete(noteId));
  },
};
