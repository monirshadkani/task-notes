import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { Task } from "@/types/task.types";

export const taskService = {
  async getTasksApi(): Promise<Task[]> {
    try {
      const response = await apiClient.get<Task[]>(ENDPOINTS.tasks.list);

      if (!Array.isArray(response)) {
        console.warn("API response is not an array:", response);
        return [];
      }

      const formattedTasks = response.map((task) => ({
        id: Number(task.id),
        description: String(task.description),
        is_completed: Boolean(task.is_completed),
        user_id: task.user_id ? Number(task.user_id) : undefined,
        note_id: task.note_id ? Number(task.note_id) : undefined,
        category_id: task.category_id ? Number(task.category_id) : undefined,
        subtasks: task.subtasks
          ? task.subtasks.map((subtask) => ({
              id: subtask.id ? Number(subtask.id) : undefined,
              description: String(subtask.description),
              is_completed: Boolean(subtask.is_completed),
            }))
          : undefined,
        created_at: task.created_at,
        updated_at: task.updated_at,
        note: task.note,
      }));

      return formattedTasks;
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      return [];
    }
  },

  async setTaskApi(
    task: Omit<Task, "id" | "created_at" | "updated_at">
  ): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(ENDPOINTS.tasks.create, task);
      return response;
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    }
  },

  async deleteTaskApi(taskId: string): Promise<void> {
    try {
      await apiClient.delete(ENDPOINTS.tasks.delete(taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    }
  },

  async updateTaskApi(taskId: string, task: Partial<Task>): Promise<void> {
    try {
      await apiClient.put<Task>(ENDPOINTS.tasks.update(taskId), task);
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    }
  },

  async toggleTaskApi(taskId: string): Promise<void> {
    try {
      await apiClient.patch<Task>(ENDPOINTS.tasks.toggle(taskId), {});
    } catch (error) {
      console.error("Failed to toggle task:", error);
      throw error;
    }
  },
};
