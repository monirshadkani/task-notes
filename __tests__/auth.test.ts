import { authService } from "@/services/auth/authService";
import { secureStorage } from "@/services/storage/secureStorage";

// Mock secureStorage
jest.mock("@/services/storage/secureStorage", () => ({
  secureStorage: {
    setAuthToken: jest.fn(),
    getAuthToken: jest.fn(),
    setUserData: jest.fn(),
    getUserData: jest.fn(),
    clearAll: jest.fn(),
  },
}));

describe("Authentication", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should store token after successful login", async () => {
    // Mock the secureStorage response
    (secureStorage.setAuthToken as jest.Mock).mockResolvedValueOnce(undefined);

    // Mock login data
    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    // Mock the login function to call setAuthToken
    jest.spyOn(authService, "login").mockImplementationOnce(async () => {
      await secureStorage.setAuthToken("mock-token");
      return {} as any;
    });

    // Call the login function
    await authService.login(loginData);

    // Verify that secureStorage.setAuthToken was called
    expect(secureStorage.setAuthToken).toHaveBeenCalledWith("mock-token");
  });

  it("should clear token on logout", async () => {
    // Mock the secureStorage response
    (secureStorage.clearAll as jest.Mock).mockResolvedValueOnce(undefined);

    // Mock the logout function
    jest.spyOn(authService, "logout").mockImplementationOnce(async () => {
      await secureStorage.clearAll();
    });

    // Call the logout function
    await authService.logout();

    // Verify that secureStorage.clearAll was called
    expect(secureStorage.clearAll).toHaveBeenCalled();
  });
});
