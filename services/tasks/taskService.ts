import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import { Task } from "@/types/task.types";

export const taskService = {
  async getTasksApi(): Promise<Task[]> {
    return apiClient.get<Task[]>(ENDPOINTS.tasks.list);
  },
};
