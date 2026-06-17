import { requireAuth } from "@/lib/auth-guard";
import { getDictionary } from "@/lib/dictionaries";
import { PageHeader } from "@/components/page-header";
import { TodoApp } from "@/components/todo/todo-app";
import { getTodos } from "@/app/actions/todo";

export default async function TodoPage() {
  const { session } = await requireAuth("/dashboard/todo");
  const lang = (session?.user as { language?: string } | undefined)?.language ?? "ja_JP";
  const dict = await getDictionary(lang, "todo");
  const todos = await getTodos();

  return (
    <>
      <PageHeader title={dict.title} dictKey="todo" entryKey="title" />
      <div className="flex-1 space-y-4 p-4 pt-6">
        <TodoApp todos={todos} dict={dict} />
      </div>
    </>
  );
}
