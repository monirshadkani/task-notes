import { createContext, useContext, useState } from "react";
import { Task } from "@/types/task.types";
import { storageService } from "@/services/storage/asyncStorage";

type TasksContextType = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => Promise<void>;
  getTasks: () => Promise<Task[]>;
};

export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  setTasks: async () => {},
  getTasks: async () => [],
});

export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasksState] = useState<Task[]>([]);

  const setTasks = async (tasks: Task[]) => {
    await storageService.setTasksStorage(tasks);
    setTasksState(tasks);
  };

  const getTasks = async () => {
    return storageService.getTasksStorage();
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        setTasks,
        getTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
