"use client";

import { useState, useTransition } from "react";
import { Todo, UpdateTodoInput } from "@/types/todo";
import { updateTodo, deleteTodo } from "@/app/actions/todo";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  MoreVertical, 
  Trash2, 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  CornerDownRight,
  Edit2,
  Check,
  X,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { TodoInput } from "./todo-input";

interface TodoItemProps {
  todo: Todo;
  dict: any;
  level?: number;
  onToggle: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string, date: string | null) => void;
  onAddSubTodo: (todo: Todo) => void;
}

export function TodoItem({ todo, dict, level = 0, onToggle, onDelete, onUpdate, onAddSubTodo }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content);
  const [showSubInput, setShowSubInput] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    onToggle(todo.id, checked);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() === todo.content) {
      setIsEditing(false);
      return;
    }
    
    startTransition(async () => {
      await updateTodo(todo.id, { content: editContent });
      onUpdate(todo.id, editContent, todo.due_date);
      setIsEditing(false);
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value).toISOString() : null;
    startTransition(async () => {
      await updateTodo(todo.id, { due_date: date });
      onUpdate(todo.id, todo.content, date);
    });
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const hasSubTodos = todo.sub_todos && todo.sub_todos.length > 0;
  
  // Format due date for display and input
  const dueDateObj = todo.due_date ? new Date(todo.due_date) : null;
  const inputDateValue = dueDateObj ? format(dueDateObj, "yyyy-MM-dd'T'HH:mm") : "";
  
  // Format for display: "MM/dd HH:mm"
  const displayDate = dueDateObj 
    ? format(dueDateObj, "MM/dd HH:mm", { locale: ja })
    : null;

  const isOverdue = dueDateObj && dueDateObj < new Date() && !todo.is_completed;

  return (
    <div className={cn("flex flex-col gap-1", level > 0 && "ml-6")}>
      <div className={cn(
        "group flex items-center gap-2 rounded-lg border bg-card p-2 text-card-foreground shadow-sm transition-all hover:bg-accent/50",
        todo.is_completed && "opacity-60 bg-muted/50",
        isOverdue && "border-destructive/50 bg-destructive/5"
      )}>
        <Checkbox 
          checked={todo.is_completed} 
          onCheckedChange={handleToggle}
          disabled={isPending}
          className="mt-0"
        />

        <div className="flex-1 min-w-0 flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input 
                value={editContent} 
                onChange={(e) => setEditContent(e.target.value)}
                autoFocus
                disabled={isPending}
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") setIsEditing(false);
                }}
              />
              <Button size="icon" variant="ghost" onClick={handleSaveEdit} disabled={isPending} className="h-8 w-8">
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)} disabled={isPending} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <span className={cn(
                "font-medium text-sm break-all flex-1 leading-tight",
                todo.is_completed && "line-through text-muted-foreground"
              )}>
                {todo.content}
              </span>
              
              {displayDate && (
                <Badge variant={isOverdue ? "destructive" : "outline"} className="shrink-0 gap-1 px-1 py-0 h-5 text-[10px] font-normal whitespace-nowrap">
                  <Calendar className="h-3 w-3" />
                  {displayDate}
                </Badge>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-0 shrink-0">
          {/* Sub-task toggle */}
          {(hasSubTodos || showSubInput) && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                {dict?.edit || "編集"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setShowSubInput(true);
                setIsExpanded(true);
              }}>
                <CornerDownRight className="h-4 w-4 mr-2" />
                {dict?.add_subtask || "サブタスクを追加"}
              </DropdownMenuItem>
              
              <div className="p-2 border-t">
                 <label className="text-xs text-muted-foreground block mb-1">
                   {dict?.due_date || "期限"}
                 </label>
                 <Input 
                   type="datetime-local" 
                   value={inputDateValue}
                   onChange={handleDateChange}
                   className="h-8 text-xs"
                 />
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {dict?.delete || "削除"}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{dict?.delete_confirm_title || "タスクの削除"}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {dict?.delete_confirm_desc || "このタスクを削除してもよろしいですか？サブタスクもすべて削除されます。"}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{dict?.cancel || "キャンセル"}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
                      {dict?.delete || "削除"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sub-todos & Input */}
      {isExpanded && (
        <div className="flex flex-col gap-2">
          {todo.sub_todos?.map((subTodo) => (
            <TodoItem 
              key={subTodo.id} 
              todo={subTodo} 
              dict={dict} 
              level={level + 1} 
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onAddSubTodo={onAddSubTodo}
            />
          ))}
          
          {showSubInput && (
            <div className={cn("ml-6")}>
               <TodoInput 
                 parentId={todo.id} 
                 dict={dict} 
                 onAdd={(newTodo) => {
                   setShowSubInput(false);
                   onAddSubTodo(newTodo);
                 }} 
                 placeholder={dict?.add_subtask || "サブタスクを追加..."}
               />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
