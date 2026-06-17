"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { CreateTodoInput, Todo } from "@/types/todo";
import { createTodo } from "@/app/actions/todo";

interface TodoInputProps {
  parentId?: string | null;
  placeholder?: string;
  onAdd?: (todo: Todo) => void;
  dict: any;
}

export function TodoInput({ parentId = null, placeholder, onAdd, dict }: TodoInputProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const input: CreateTodoInput = {
        content: content.trim(),
        parent_id: parentId,
      };
      
      const result = await createTodo(input);
      if (result) {
        setContent("");
        onAdd?.(result);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder || dict?.enter_task || "タスクを入力..."}
        className="flex-1"
        disabled={isPending}
      />
      <Button type="submit" size="icon" disabled={isPending || !content.trim()}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        <span className="sr-only">{dict?.add_task || "追加"}</span>
      </Button>
    </form>
  );
}
