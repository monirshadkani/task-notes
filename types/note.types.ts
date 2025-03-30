import { Category } from "./category.types";

export interface Note {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  categories: (Category & {
    pivot: {
      note_id: number;
      category_id: number;
    };
  })[];
}
