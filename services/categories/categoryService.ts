import { ApiResponse } from "@/types";
import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { Category } from "@/types";

export const categoryService = {
  async getCategoriesApi(): Promise<Category[]> {
    return apiClient.get<Category[]>(ENDPOINTS.categories.list);
  },

  async setCategories(
    category: Omit<Category, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<void> {
    await apiClient.post<ApiResponse<Category>>(ENDPOINTS.categories.create, {
      name: category.name,
      color: category.color,
      is_system: category.is_system,
    });
  },
};
