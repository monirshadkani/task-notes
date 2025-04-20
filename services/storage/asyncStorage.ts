import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { User } from "../auth/auth.types";
import { Note } from "@/types/note.types";
import { Task } from "@/types/task.types";
import { Category } from "@/types";
import {
  validateNote,
  validateTask,
  validateCategory,
  validateDataArray,
} from "@/utils/validation";

const STORAGE_KEYS = {
  USER_TOKEN: "userToken",
  USER_DATA: "userData",
  NOTES: "notes",
  CATEGORIES: "categories",
  TASKS: "tasks",
} as const;

export const storageService = {
  async setUserToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    } catch (error) {
      console.error("Error setting user token:", error);
      throw error;
    }
  },

  async getUserToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error("Error getting user token:", error);
      return null;
    }
  },

  async setUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error("Error setting user data:", error);
      throw error;
    }
  },

  async getUserData(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  async removeUserData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error("Error removing user data:", error);
      throw error;
    }
  },

  async setNotesStorage(notes: Note[]): Promise<void> {
    try {
      if (!validateDataArray(notes, validateNote)) {
        throw new Error("Invalid notes data structure");
      }
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (error) {
      console.error("Error setting notes:", error);
      throw error;
    }
  },

  async getNotesStorage(): Promise<Note[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!validateDataArray(parsed, validateNote)) {
        console.warn("Invalid notes data structure found in storage");
        return [];
      }
      return parsed;
    } catch (error) {
      console.error("Error parsing notes:", error);
      return [];
    }
  },

  async setTasksStorage(tasks: Task[]): Promise<void> {
    try {
      if (!validateDataArray(tasks, validateTask)) {
        throw new Error("Invalid tasks data structure");
      }
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error setting tasks:", error);
      throw error;
    }
  },

  async getTasksStorage(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!validateDataArray(parsed, validateTask)) {
        console.warn("Invalid tasks data structure found in storage");
        return [];
      }
      return parsed;
    } catch (error) {
      console.error("Error parsing tasks:", error);
      return [];
    }
  },

  async setCategoriesStorage(categories: Category[]): Promise<void> {
    try {
      if (!validateDataArray(categories, validateCategory)) {
        throw new Error("Invalid categories data structure");
      }
      await AsyncStorage.setItem(
        STORAGE_KEYS.CATEGORIES,
        JSON.stringify(categories)
      );
    } catch (error) {
      console.error("Error setting categories:", error);
      throw error;
    }
  },

  async getCategoriesStorage(): Promise<Category[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!validateDataArray(parsed, validateCategory)) {
        console.warn("Invalid categories data structure found in storage");
        return [];
      }
      return parsed;
    } catch (error) {
      console.error("Error parsing categories:", error);
      return [];
    }
  },

  async refreshApp(): Promise<void> {
    try {
      const keysToRemove = [
        STORAGE_KEYS.NOTES,
        STORAGE_KEYS.CATEGORIES,
        STORAGE_KEYS.TASKS,
      ];

      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error("Error refreshing app:", error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  },
};
