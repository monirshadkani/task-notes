import { createContext, useContext, useState, useEffect } from "react";
import { Task } from "@/types/task.types";
import { storageService } from "@/services/storage/asyncStorage";
import { taskService } from "@/services/tasks/taskService";

type TasksContextType = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => Promise<void>;
  getTasks: () => Promise<Task[]>;
  refreshTasks: () => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
};

export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  setTasks: async () => {},
  getTasks: async () => [],
  refreshTasks: async () => {},
  deleteTask: async () => {},
  updateTask: async () => {},
});

export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshTasks = async () => {
    try {
      const apiTasks = await taskService.getTasksApi();
      await storageService.setTasksStorage(apiTasks);
      setTasksState(apiTasks);
    } catch (error) {
      console.error("Failed to refresh tasks:", error);
    }
  };

  useEffect(() => {
    const initializeTasks = async () => {
      if (isInitialized) return;

      try {
        const storedTasks = await storageService.getTasksStorage();
        if (storedTasks.length === 0) {
          await refreshTasks();
        } else {
          setTasksState(storedTasks);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    initializeTasks();
  }, [isInitialized]);

  const deleteTask = async (id: string) => {
    try {
      // Update local state first for immediate UI feedback
      const updatedTasks = tasks.filter((task) => task.id.toString() !== id);
      setTasksState(updatedTasks);
      await storageService.setTasksStorage(updatedTasks);

      // Then make the API call
      await taskService.deleteTaskApi(id);
    } catch (error) {
      // If API call fails, revert to previous state
      console.error("Failed to delete task:", error);
      const storedTasks = await storageService.getTasksStorage();
      setTasksState(storedTasks);
      throw error;
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      // Update local state first for immediate UI feedback
      const updatedTasks = tasks.map((task) =>
        task.id.toString() === id ? { ...task, ...taskData } : task
      );
      setTasksState(updatedTasks);
      await storageService.setTasksStorage(updatedTasks);

      // Then make the API call
      await taskService.updateTaskApi(id, taskData);
    } catch (error) {
      // If API call fails, revert to previous state
      console.error("Failed to update task:", error);
      const storedTasks = await storageService.getTasksStorage();
      setTasksState(storedTasks);
      throw error;
    }
  };

  const setTasks = async (tasks: Task[]) => {
    await storageService.setTasksStorage(tasks);
    setTasksState(tasks);
  };

  const getTasks = async () => {
    const storedTasks = await storageService.getTasksStorage();
    if (storedTasks.length === 0) {
      await refreshTasks();
      return await storageService.getTasksStorage();
    }
    return storedTasks;
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        setTasks,
        getTasks,
        refreshTasks,
        deleteTask,
        updateTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
