import { API_URL } from "@/services/api/endpoints";
import { secureStorage } from "@/services/storage/secureStorage";

interface ApiError {
  message: string;
  status?: number;
}

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const token = await secureStorage.getAuthToken();

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || "Something went wrong",
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();

      if (endpoint === "/login") {
        return data as T;
      }

      if (data && typeof data === "object") {
        if ("data" in data) {
          return data.data as T;
        }
        if (Array.isArray(data)) {
          return data as T;
        }
        return data as T;
      }

      console.warn("Unexpected API response format:", data);
      return data as T;
    } catch (error) {
      console.error("API request failed:", error);
      const apiError = error as ApiError;
      throw {
        message: apiError.message || "Failed to connect to the server",
        status: apiError.status,
      } as ApiError;
    }
  },

  get: <T>(endpoint: string) => apiClient.request<T>(endpoint),

  post: <T>(endpoint: string, body: any) =>
    apiClient.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: any) =>
    apiClient.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: any) =>
    apiClient.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) => {
    return apiClient.request<T>(endpoint, {
      method: "DELETE",
    });
  },
};
