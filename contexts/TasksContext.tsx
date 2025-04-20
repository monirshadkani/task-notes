import { createContext, useContext, useState, useEffect } from "react";
import { Task } from "@/types/task.types";
import { storageService } from "@/services/storage/asyncStorage";
import { taskService } from "@/services/tasks/taskService";
import { useNotes } from "@/contexts/NotesContext";

type TasksContextType = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => Promise<void>;
  getTasks: () => Promise<Task[]>;
  refreshTasks: () => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
};

export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  setTasks: async () => {},
  getTasks: async () => [],
  refreshTasks: async () => {},
  deleteTask: async () => {},
  updateTask: async () => {},
  toggleTask: async () => {},
});

export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { notes } = useNotes();

  const refreshTasks = async () => {
    try {
      const apiTasks = await taskService.getTasksApi();
      if (apiTasks && apiTasks.length > 0) {
        const enrichedTasks = apiTasks.map((task) => {
          if (task.note_id) {
            const associatedNote = notes.find(
              (note) => note.id === task.note_id
            );
            if (associatedNote) {
              return {
                ...task,
                note: associatedNote,
              };
            }
          }
          return task;
        });

        await storageService.setTasksStorage(enrichedTasks);
        setTasksState(enrichedTasks);
      }
    } catch (error) {
      console.error("Failed to refresh tasks:", error);
    }
  };

  useEffect(() => {
    const initializeTasks = async () => {
      if (isInitialized) return;

      try {
        const storedTasks = await storageService.getTasksStorage();
        if (storedTasks && storedTasks.length > 0) {
          const enrichedTasks = storedTasks.map((task) => {
            if (task.note_id) {
              const associatedNote = notes.find(
                (note) => note.id === task.note_id
              );
              if (associatedNote) {
                return {
                  ...task,
                  note: associatedNote,
                };
              }
            }
            return task;
          });
          setTasksState(enrichedTasks);
        } else {
          await refreshTasks();
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize tasks:", error);
        setTasksState([]);
        setIsInitialized(true);
      }
    };

    initializeTasks();
  }, [isInitialized, notes]);

  const deleteTask = async (id: string) => {
    try {
      const updatedTasks = tasks.filter((task) => task.id.toString() !== id);
      setTasksState(updatedTasks);
      await storageService.setTasksStorage(updatedTasks);

      await taskService.deleteTaskApi(id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      const storedTasks = await storageService.getTasksStorage();
      setTasksState(storedTasks);
      throw error;
    }
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    try {
      const updatedTasks = tasks.map((t) =>
        t.id.toString() === id ? { ...t, ...task } : t
      );
      setTasksState(updatedTasks);
      await storageService.setTasksStorage(updatedTasks);

      await taskService.updateTaskApi(id, task);
    } catch (error) {
      console.error("Failed to update task:", error);
      const storedTasks = await storageService.getTasksStorage();
      setTasksState(storedTasks);
      throw error;
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const updatedTasks = tasks.map((t) =>
        t.id.toString() === id ? { ...t, is_completed: !t.is_completed } : t
      );
      setTasksState(updatedTasks);
      await storageService.setTasksStorage(updatedTasks);

      taskService.toggleTaskApi(id).catch((error) => {
        console.error("Failed to sync toggle with API:", error);
      });
    } catch (error) {
      console.error("Failed to toggle task:", error);
      throw error;
    }
  };

  const setTasks = async (tasks: Task[]) => {
    await storageService.setTasksStorage(tasks);
    setTasksState(tasks);
  };

  const getTasks = async () => {
    const storedTasks = await storageService.getTasksStorage();
    if (storedTasks && storedTasks.length > 0) {
      return storedTasks;
    }
    await refreshTasks();
    return await storageService.getTasksStorage();
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
        toggleTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
