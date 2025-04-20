import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import { Task } from "@/types/task.types";

export const taskService = {
  async getTasksApi(): Promise<Task[]> {
    return apiClient.get<Task[]>(ENDPOINTS.tasks.list);
  },

  async setTaskApi(
    task: Omit<Task, "id" | "created_at" | "updated_at">
  ): Promise<Task> {
    const response = await apiClient.post<Task>(ENDPOINTS.tasks.create, task);
    return response;
  },

  async deleteTaskApi(taskId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.tasks.delete(taskId));
  },

  async updateTaskApi(taskId: string, task: Partial<Task>): Promise<void> {
    await apiClient.put<Task>(ENDPOINTS.tasks.update(taskId), task);
  },
};
