import { API_URL } from "@/services/api/endpoints";
import { storageService } from "../storage/asyncStorage";

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const token = await storageService.getUserToken();

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

      const responseData = await response.json();

      if (!response.ok) {
        throw { message: responseData.message || "Something went wrong" };
      }

      if (endpoint === "/login") {
        return responseData;
      }

      return responseData.data;
    } catch (error) {
      throw { message: "Failed to connect to the server" };
    }
  },

  get: <T>(endpoint: string) => apiClient.request<T>(endpoint),

  //add xrequested with etc for post
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

  delete: <T>(endpoint: string) =>
    apiClient.request<T>(endpoint, {
      method: "DELETE",
    }),
};
