"use client";

import { Todo } from "@/types/todo";
import { TodoItem } from "./todo-item";
import { TodoInput } from "./todo-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, ListTodo } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppearance } from "@/components/appearance-provider";
import { updateTodo, deleteTodo } from "@/app/actions/todo";

interface TodoAppProps {
  todos: Todo[];
  dict: any;
}

export function TodoApp({ todos: initialTodos, dict }: TodoAppProps) {
  const { dictionaries } = useAppearance();
  const todoDict = dictionaries?.todo || dict;
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Sync with server props
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const toggleDeep = (list: Todo[], id: string, checked: boolean): Todo[] => {
    return list.map(todo => {
      if (todo.id === id) {
        // Helper to recursively set completion status
        const setAllStatus = (subList: Todo[] | undefined, status: boolean): Todo[] => {
          if (!subList) return [];
          return subList.map(t => ({
            ...t,
            is_completed: status,
            sub_todos: setAllStatus(t.sub_todos, status)
          }));
        };

        return { 
          ...todo, 
          is_completed: checked,
          // If checking (completing), cascade to all children.
          // If unchecking, standard behavior is usually NOT to uncheck children (they might be done).
          // However, to keep it simple and match server logic which currently only cascades 'complete',
          // we will cascade 'complete' on UI too.
          sub_todos: checked && todo.sub_todos ? setAllStatus(todo.sub_todos, true) : todo.sub_todos
        };
      }
      if (todo.sub_todos && todo.sub_todos.length > 0) {
        return {
          ...todo,
          sub_todos: toggleDeep(todo.sub_todos, id, checked)
        };
      }
      return todo;
    });
  };

  const deleteDeep = (list: Todo[], id: string): Todo[] => {
    return list.filter(todo => todo.id !== id).map(todo => {
      if (todo.sub_todos && todo.sub_todos.length > 0) {
        return {
          ...todo,
          sub_todos: deleteDeep(todo.sub_todos, id)
        };
      }
      return todo;
    });
  };

  const updateDeep = (list: Todo[], id: string, content: string, date: string | null): Todo[] => {
    return list.map(todo => {
      if (todo.id === id) {
        return { ...todo, content, due_date: date };
      }
      if (todo.sub_todos && todo.sub_todos.length > 0) {
        return {
          ...todo,
          sub_todos: updateDeep(todo.sub_todos, id, content, date)
        };
      }
      return todo;
    });
  };

  const addDeep = (list: Todo[], newTodo: Todo): Todo[] => {
    if (!newTodo.parent_id) {
      return [newTodo, ...list];
    }
    return list.map(todo => {
      if (todo.id === newTodo.parent_id) {
        return {
          ...todo,
          sub_todos: [newTodo, ...(todo.sub_todos || [])]
        };
      }
      if (todo.sub_todos && todo.sub_todos.length > 0) {
        return {
          ...todo,
          sub_todos: addDeep(todo.sub_todos, newTodo)
        };
      }
      return todo;
    });
  };

  const handleToggle = async (id: string, checked: boolean) => {
    setTodos(prev => toggleDeep(prev, id, checked));
    // Server sync
    await updateTodo(id, { is_completed: checked });
  };

  const handleDelete = async (id: string) => {
    setTodos(prev => deleteDeep(prev, id));
    await deleteTodo(id);
  };

  const handleUpdate = (id: string, content: string, date: string | null) => {
    setTodos(prev => updateDeep(prev, id, content, date));
    // updateTodo is called in TodoItem transition, we just update local state here
  };

  const handleAdd = (newTodo: Todo) => {
    setTodos(prev => addDeep(prev, newTodo));
  };

  // Helper to filter recursively
  const filterTodos = (list: Todo[]): Todo[] => {
    if (filter === "all") return list;
    
    // For recursive filtering, if a parent matches, show it. 
    // If a child matches, show parent (maybe?).
    // Standard behavior: Filter top level. If active, show active roots.
    // But if a root is active, do we show its completed children? Usually yes.
    // Let's stick to root level filtering for now, or simple flat filtering logic applied to roots.
    // Existing logic was: return list.filter(...)
    
    return list.filter(todo => {
      if (filter === "active") return !todo.is_completed;
      if (filter === "completed") return todo.is_completed;
      return true;
    });
  };

  const filteredTodos = filterTodos(todos);

  const countTodos = (list: Todo[], status: "all" | "active" | "completed"): number => {
    let count = 0;
    for (const todo of list) {
      const isCompleted = todo.is_completed;
      const matches = status === "all" 
        ? true 
        : status === "completed" 
          ? isCompleted 
          : !isCompleted;
      
      if (matches) count++;
      
      if (todo.sub_todos && todo.sub_todos.length > 0) {
        count += countTodos(todo.sub_todos, status);
      }
    }
    return count;
  };

  const activeCount = countTodos(todos, "active");
  const completedCount = countTodos(todos, "completed");
  const totalCount = countTodos(todos, "all");

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {todoDict?.filter_all || "すべて"}
            </CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {todoDict?.filter_active || "未完了"}
            </CardTitle>
            <div className="h-4 w-4 rounded-full border-2 border-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {todoDict?.filter_completed || "完了"}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <div className="flex items-center justify-between mb-4">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">{todoDict?.filter_all || "すべて"}</TabsTrigger>
              <TabsTrigger value="active">{todoDict?.filter_active || "未完了"}</TabsTrigger>
              <TabsTrigger value="completed">{todoDict?.filter_completed || "完了"}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mb-6">
          <TodoInput dict={todoDict} onAdd={handleAdd} />
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                {todoDict?.no_tasks || "タスクがありません"}
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  dict={todoDict} 
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onAddSubTodo={handleAdd}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
