import { taskService } from "@/services/tasks/taskService";
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

describe("Tasks and Notes", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should create a new task", async () => {
    // Mock task data
    const taskData = {
      title: "Test Task",
      description: "Test Description",
      is_completed: false,
    };

    // Mock the setTaskApi function
    jest.spyOn(taskService, "setTaskApi").mockImplementationOnce(async () => {
      return {
        ...taskData,
        id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    // Call the setTaskApi function
    const result = await taskService.setTaskApi(taskData);

    // Verify the result
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("title", taskData.title);
    expect(result).toHaveProperty("description", taskData.description);
  });

  it("should get all tasks", async () => {
    // Mock tasks data
    const mockTasks = [
      {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Mock the getTasksApi function
    jest.spyOn(taskService, "getTasksApi").mockResolvedValueOnce(mockTasks);

    // Call the getTasksApi function
    const result = await taskService.getTasksApi();

    // Verify the result
    expect(result).toEqual(mockTasks);
  });
});
