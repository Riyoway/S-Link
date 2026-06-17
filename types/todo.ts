export interface Todo {
  id: string;
  user_id: string;
  content: string;
  is_completed: boolean;
  due_date: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  // For UI nesting
  sub_todos?: Todo[];
}

export type CreateTodoInput = {
  content: string;
  parent_id?: string | null;
  due_date?: string | null;
};

export type UpdateTodoInput = {
  content?: string;
  is_completed?: boolean;
  due_date?: string | null;
  parent_id?: string | null;
};
