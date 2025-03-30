export interface Category {
  id: number;
  name: string;
  color: string;
  is_system: boolean;
  user_id: number | null;
  created_at: string;
  updated_at: string;
}
