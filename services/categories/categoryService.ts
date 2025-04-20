import { ApiResponse } from "@/types";
import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { Category } from "@/types/category.types";

export const categoryService = {
  async getCategoriesApi(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>(
        ENDPOINTS.categories.list
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
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

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(ENDPOINTS.categories.delete(id));
  },

  async updateCategory(
    id: string,
    category: Omit<Category, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<void> {
    await apiClient.put<ApiResponse<Category>>(
      ENDPOINTS.categories.update(id),
      {
        name: category.name,
        color: category.color,
        is_system: category.is_system,
      }
    );
  },
};
