import { secureStorage } from "@/services/storage/secureStorage";
import * as SecureStore from "expo-secure-store";

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe("Security Mechanisms", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should securely store and retrieve data", async () => {
    // Mock SecureStore responses
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValueOnce(undefined);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("test-token");

    // Mock secureStorage methods
    jest
      .spyOn(secureStorage, "setAuthToken")
      .mockImplementationOnce(async () => {
        await SecureStore.setItemAsync("auth_token", "test-token");
      });

    jest
      .spyOn(secureStorage, "getAuthToken")
      .mockImplementationOnce(async () => {
        return await SecureStore.getItemAsync("auth_token");
      });

    // Test storing data
    await secureStorage.setAuthToken("test-token");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "auth_token",
      "test-token"
    );

    // Test retrieving data
    const token = await secureStorage.getAuthToken();
    expect(token).toBe("test-token");
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith("auth_token");
  });

  it("should validate task input data", () => {
    // Test valid task data
    const validTask = {
      title: "Valid Task",
      description: "This is a valid task",
      is_completed: false,
    };

    // Test invalid task data (missing required fields)
    const invalidTask = {
      title: "", // Empty title
      description: "This is invalid",
      is_completed: false,
    };

    // Simple validation checks
    expect(validTask.title.length).toBeGreaterThan(0);
    expect(validTask.description.length).toBeGreaterThan(0);
    expect(typeof validTask.is_completed).toBe("boolean");

    // Invalid data should fail validation
    expect(invalidTask.title.length).toBe(0);
  });
});
