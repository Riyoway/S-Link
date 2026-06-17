import { requireAuth } from "@/lib/auth-guard";
import { getDictionary } from "@/lib/dictionaries";
import { PageHeader } from "@/components/page-header";
import { ToolsApp } from "@/components/tools/tools-app";

export default async function ToolsPage() {
  const { session } = await requireAuth("/dashboard/tools");
  const lang = (session?.user as { language?: string } | undefined)?.language ?? "ja_JP";
  const dict = await getDictionary(lang, "tools");

  return (
    <>
      <PageHeader title={dict.title} dictKey="tools" entryKey="title" />
      <div className="flex-1 space-y-4 p-4 pt-6">
        <ToolsApp dict={dict} />
      </div>
    </>
  );
}