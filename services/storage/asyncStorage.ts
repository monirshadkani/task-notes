import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { User } from "../auth/auth.types";
import { Note } from "@/types/note.types";
import { Task } from "@/types/task.types";
import { Category } from "@/types";

const STORAGE_KEYS = {
  USER_TOKEN: "userToken",
  USER_DATA: "userData",
  NOTES: "notes",
  CATEGORIES: "categories",
  TASKS: "tasks",
} as const;

//change for secure storage for auth instead of asyncstorage
//maybe use drizzle to store the rest

export const storageService = {
  async setUserToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
  },

  async getUserToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  },

  async setUserData(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  async getUserData(): Promise<User | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    return null;
  },

  async removeUserData(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  },

  async setNotesStorage(notes: Note[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },
  async getNotesStorage(): Promise<Note[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error(error);
        return [];
      }
    }
    return [];
  },

  async setTasksStorage(tasks: Task[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  async getTasksStorage(): Promise<Task[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error(error);
        return [];
      }
    }
    return [];
  },

  async setCategoriesStorage(categories: Category[]): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CATEGORIES,
      JSON.stringify(categories)
    );
  },

  async getCategoriesStorage(): Promise<Category[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error(error);
        return [];
      }
    }
    return [];
  },

  async refreshApp(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.NOTES,
        STORAGE_KEYS.TASKS,
        STORAGE_KEYS.CATEGORIES,
      ]);
    } catch (error) {
      console.error(error);
    }
  },
  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  },
};
