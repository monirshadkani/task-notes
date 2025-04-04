import { Note } from "./note.types";

export interface Task {
  id: number;
  description: string;
  is_completed: boolean;
  user_id: number;
  note_id: number;
  category_id: number;
  subtasks: Subtask[];
  created_at: string;
  updated_at: string;
  note: Note;
}

export interface Subtask {
  id: number;
  description: string;
  is_completed: boolean;
}
