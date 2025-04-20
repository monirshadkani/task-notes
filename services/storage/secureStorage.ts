import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";
import { User } from "@/services/auth/auth.types";
import { getTokenExpiration, isTokenExpired } from "@/utils/auth";

const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  TOKEN_EXPIRATION: "token_expiration",
};

const isWeb = Platform.OS === "web";

export const secureStorage = {
  async setAuthToken(token: string): Promise<void> {
    try {
      if (isWeb) {
        sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        const expiration = getTokenExpiration();
        sessionStorage.setItem(
          STORAGE_KEYS.TOKEN_EXPIRATION,
          expiration.toString()
        );
      } else {
        await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
        const expiration = getTokenExpiration();
        await SecureStore.setItemAsync(
          STORAGE_KEYS.TOKEN_EXPIRATION,
          expiration.toString()
        );
      }
    } catch (error) {
      console.error("Error setting auth token:", error);
      throw error;
    }
  },

  async getAuthToken(): Promise<string | null> {
    try {
      let token: string | null = null;
      let expiration: string | null = null;

      if (isWeb) {
        token = sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        expiration = sessionStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRATION);
      } else {
        token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        expiration = await SecureStore.getItemAsync(
          STORAGE_KEYS.TOKEN_EXPIRATION
        );
      }

      if (!token || !expiration) return null;

      const expirationTime = parseInt(expiration, 10);
      if (isNaN(expirationTime) || isTokenExpired(expirationTime)) {
        await this.clearAll();
        return null;
      }

      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  },

  async setUserData(userData: User): Promise<void> {
    try {
      const data = JSON.stringify(userData);
      if (isWeb) {
        sessionStorage.setItem(STORAGE_KEYS.USER_DATA, data);
      } else {
        await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, data);
      }
    } catch (error) {
      console.error("Error setting user data:", error);
      throw error;
    }
  },

  async getUserData(): Promise<User | null> {
    try {
      let data: string | null;
      if (isWeb) {
        data = sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
      } else {
        data = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      }
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  },

  async clearAll(): Promise<void> {
    try {
      if (isWeb) {
        sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRATION);
      } else {
        // @ts-ignore - expo-secure-store types are incorrect
        await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        // @ts-ignore - expo-secure-store types are incorrect
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
        // @ts-ignore - expo-secure-store types are incorrect
        await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN_EXPIRATION);
      }
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  },
};

export class SecureStorageService {
  private static instance: SecureStorageService;
  private readonly isWeb: boolean;
  private readonly TOKEN_KEY = "auth_token";
  private readonly USER_KEY = "user_data";
  private readonly EXPIRATION_KEY = "token_expiration";

  private constructor() {
    this.isWeb = Platform.OS === "web";
  }

  static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  private async getEncryptionKey(): Promise<string> {
    if (this.isWeb) {
      const storedKey = sessionStorage.getItem(this.EXPIRATION_KEY);
      if (storedKey) {
        return storedKey;
      }
      const bytes = await Crypto.getRandomBytesAsync(32);
      const newKey = Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      sessionStorage.setItem(this.EXPIRATION_KEY, newKey);
      return newKey;
    } else {
      const storedKey = await SecureStore.getItemAsync(this.EXPIRATION_KEY);
      if (storedKey) {
        return storedKey;
      }
      const bytes = await Crypto.getRandomBytesAsync(32);
      const newKey = Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      await SecureStore.setItemAsync(this.EXPIRATION_KEY, newKey);
      return newKey;
    }
  }

  private async encryptData(data: string): Promise<string> {
    const key = await this.getEncryptionKey();
    const bytes = await Crypto.getRandomBytesAsync(16);
    const iv = Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    const encrypted = this.xorEncrypt(data, key);
    return JSON.stringify({ iv, data: encrypted });
  }

  private async decryptData(encryptedData: string): Promise<string> {
    try {
      const key = await this.getEncryptionKey();
      if (!encryptedData) {
        throw new Error("No encrypted data provided");
      }

      const parsedData = JSON.parse(encryptedData);
      if (!parsedData || !parsedData.data) {
        throw new Error("Invalid encrypted data format");
      }

      return this.xorDecrypt(parsedData.data, key);
    } catch (error) {
      console.error("Error decrypting data:", error);
      // If decryption fails, return empty string instead of throwing
      return "";
    }
  }

  private xorEncrypt(text: string, key: string): string {
    if (!text || !key) {
      return "";
    }
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  }

  private xorDecrypt(text: string, key: string): string {
    if (!text || !key) {
      return "";
    }
    return this.xorEncrypt(text, key); // XOR is symmetric
  }

  async setAuthToken(token: string): Promise<void> {
    try {
      if (this.isWeb) {
        sessionStorage.setItem(this.TOKEN_KEY, token);
        const expiration = getTokenExpiration();
        sessionStorage.setItem(this.EXPIRATION_KEY, expiration.toString());
      } else {
        await SecureStore.setItemAsync(this.TOKEN_KEY, token);
        const expiration = getTokenExpiration();
        await SecureStore.setItemAsync(
          this.EXPIRATION_KEY,
          expiration.toString()
        );
      }
    } catch (error) {
      console.error("Error saving auth token:", error);
      throw new Error("Failed to save authentication token");
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      let token: string | null = null;
      let expiration: string | null = null;

      if (this.isWeb) {
        token = sessionStorage.getItem(this.TOKEN_KEY);
        expiration = sessionStorage.getItem(this.EXPIRATION_KEY);
      } else {
        token = await SecureStore.getItemAsync(this.TOKEN_KEY);
        expiration = await SecureStore.getItemAsync(this.EXPIRATION_KEY);
      }

      if (!token || !expiration) return null;

      const expirationTime = parseInt(expiration, 10);
      if (isNaN(expirationTime) || isTokenExpired(expirationTime)) {
        await this.clearAll();
        return null;
      }

      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }

  async setUserData(userData: User): Promise<void> {
    try {
      const data = JSON.stringify(userData);
      if (this.isWeb) {
        sessionStorage.setItem(this.USER_KEY, data);
      } else {
        await SecureStore.setItemAsync(this.USER_KEY, data);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      throw new Error("Failed to save user data");
    }
  }

  async getUserData(): Promise<User | null> {
    try {
      let data: string | null;
      if (this.isWeb) {
        data = sessionStorage.getItem(this.USER_KEY);
      } else {
        data = await SecureStore.getItemAsync(this.USER_KEY);
      }
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  async clearAll(): Promise<void> {
    try {
      if (this.isWeb) {
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);
        sessionStorage.removeItem(this.EXPIRATION_KEY);
      } else {
        await SecureStore.deleteItemAsync(this.TOKEN_KEY);
        await SecureStore.deleteItemAsync(this.USER_KEY);
        await SecureStore.deleteItemAsync(this.EXPIRATION_KEY);
      }
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw new Error("Failed to clear storage");
    }
  }
}

export const secureStorageService = SecureStorageService.getInstance();
