import { ApiResponse } from "@/types";
import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { Category } from "@/types";

export const categoryService = {
  async getCategoriesApi(): Promise<Category[]> {
    return apiClient.get<Category[]>(ENDPOINTS.categories.list);
  },

  async setCategories(category: Category): Promise<void> {
    apiClient.post<ApiResponse<Category>>(ENDPOINTS.categories.create, {
      name: category.name,
      color: category.color,
      created_at: category.created_at,
      updated_at: category.updated_at,
    });
  },
};
