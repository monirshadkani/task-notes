import { Note } from "@/types/note.types";
import { Task } from "@/types/task.types";
import { Category } from "@/types/category.types";

export const validateNote = (note: Note): boolean => {
  if (!note) return false;
  if (typeof note.id !== "number") return false;
  if (typeof note.title !== "string" || note.title.trim() === "") return false;
  if (typeof note.content !== "string") return false;
  if (!Array.isArray(note.categories)) return false;

  for (const category of note.categories) {
    if (!validateCategory(category)) return false;
  }

  return true;
};

export const validateTask = (task: Task): boolean => {
  if (!task) return false;

  if (!task.id || typeof task.id !== "number") return false;
  if (
    !task.description ||
    typeof task.description !== "string" ||
    task.description.trim() === ""
  )
    return false;
  if (typeof task.is_completed !== "boolean") return false;

  if (task.user_id !== undefined && typeof task.user_id !== "number")
    return false;
  if (
    task.note_id !== undefined &&
    task.note_id !== null &&
    typeof task.note_id !== "number"
  )
    return false;
  if (task.category_id !== undefined && typeof task.category_id !== "number")
    return false;
  if (task.created_at !== undefined && typeof task.created_at !== "string")
    return false;
  if (task.updated_at !== undefined && typeof task.updated_at !== "string")
    return false;

  if (task.note !== undefined && task.note !== null) {
    if (!task.note.id || typeof task.note.id !== "number") return false;
    if (!task.note.title || typeof task.note.title !== "string") return false;
    if (!task.note.content || typeof task.note.content !== "string")
      return false;
  }

  if (task.subtasks !== undefined) {
    if (!Array.isArray(task.subtasks)) return false;
    for (const subtask of task.subtasks) {
      if (!subtask || typeof subtask !== "object") return false;
      if (
        !subtask.description ||
        typeof subtask.description !== "string" ||
        subtask.description.trim() === ""
      )
        return false;
      if (typeof subtask.is_completed !== "boolean") return false;
    }
  }

  return true;
};

export const validateCategory = (category: Category): boolean => {
  if (!category) return false;
  if (typeof category.id !== "number") return false;
  if (typeof category.name !== "string" || category.name.trim() === "")
    return false;
  if (
    typeof category.color !== "string" ||
    !/^#[0-9A-Fa-f]{6}$/.test(category.color)
  )
    return false;
  if (typeof category.is_system !== "boolean") return false;

  return true;
};

export const validateDataArray = <T>(
  data: T[],
  validator: (item: T) => boolean
): boolean => {
  if (!Array.isArray(data)) return false;
  return data.every(validator);
};
