"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Todo, CreateTodoInput, UpdateTodoInput } from "@/types/todo";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Helper to get Supabase client with admin access
const getSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
};

// Helper to get current authenticated user's ID from next_auth table
const getCurrentUserId = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const supabase = getSupabase();
  const { data: user } = await supabase
    .schema("next_auth")
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  return user?.id;
};

export async function getTodos(): Promise<Todo[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const supabase = getSupabase();
  const { data: todos, error } = await supabase
    .schema("next_auth")
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching todos:", error);
    return [];
  }

  // Build tree structure
  const todoMap = new Map<string, Todo>();
  // Initialize map with empty sub_todos
  todos?.forEach((todo: any) => {
    todoMap.set(todo.id, { ...todo, sub_todos: [] });
  });

  const rootTodos: Todo[] = [];

  todos?.forEach((todo: any) => {
    const currentTodo = todoMap.get(todo.id)!;
    if (todo.parent_id) {
      const parent = todoMap.get(todo.parent_id);
      if (parent) {
        parent.sub_todos?.push(currentTodo);
      } else {
        rootTodos.push(currentTodo);
      }
    } else {
      rootTodos.push(currentTodo);
    }
  });
  
  // Sort function: Incomplete first, then by date desc
  const sortTodos = (list: Todo[]) => {
      list.sort((a, b) => {
        if (a.is_completed === b.is_completed) {
           return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.is_completed ? 1 : -1;
      });

      list.forEach(item => {
          if (item.sub_todos && item.sub_todos.length > 0) {
              sortTodos(item.sub_todos);
          }
      });
  };
  
  sortTodos(rootTodos);

  return rootTodos;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const supabase = getSupabase();

  // Check storage limit
  const STORAGE_LIMIT = 2 * 1024 * 1024; // 2MB
  const { data: currentUsage } = await supabase.rpc("get_user_storage_usage", {
    target_user_id: userId
  });
  
  const newSize = new Blob([input.content]).size;
  
  if ((currentUsage || 0) + newSize > STORAGE_LIMIT) {
    console.error("Storage limit exceeded");
    throw new Error("Storage limit exceeded (2MB total for Memo + Todo)");
  }

  const { data, error } = await supabase
    .schema("next_auth")
    .from("todos")
    .insert({
      user_id: userId,
      content: input.content,
      parent_id: input.parent_id,
      due_date: input.due_date,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating todo:", error);
    return null;
  }

  revalidatePath("/dashboard/todo");
  return { ...data, sub_todos: [] } as Todo;
}

export async function updateTodo(id: string, input: UpdateTodoInput): Promise<Todo | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const supabase = getSupabase();

  // Check storage limit if content is being updated
  if (input.content !== undefined) {
    const STORAGE_LIMIT = 2 * 1024 * 1024; // 2MB
    const { data: currentUsage } = await supabase.rpc("get_user_storage_usage", {
      target_user_id: userId,
      exclude_table: 'todos',
      exclude_id: id
    });
    
    // We only care about content size for todos
    const newSize = new Blob([input.content]).size;
    
    if ((currentUsage || 0) + newSize > STORAGE_LIMIT) {
       console.error("Storage limit exceeded");
       throw new Error("Storage limit exceeded (2MB total for Memo + Todo)");
    }
  }

  // If marking as completed, cascade to children
  if (input.is_completed === true) {
     await supabase.rpc("cascade_complete_todo", {
       target_todo_id: id,
       target_user_id: userId
     });
  }

  const { data, error } = await supabase
    .schema("next_auth")
    .from("todos")
    .update({
      content: input.content,
      is_completed: input.is_completed,
      due_date: input.due_date,
      parent_id: input.parent_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating todo:", error);
    return null;
  }

  revalidatePath("/dashboard/todo");
  return data as Todo;
}

export async function deleteTodo(id: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const supabase = getSupabase();
  const { error } = await supabase
    .schema("next_auth")
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting todo:", error);
    return false;
  }

  revalidatePath("/dashboard/todo");
  return true;
}
