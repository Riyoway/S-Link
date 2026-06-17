import { requireAuth } from "@/lib/auth-guard";
import { getDictionary } from "@/lib/dictionaries";
import { PageHeader } from "@/components/page-header";
import { GuideContent } from "@/components/guide/guide-content";

export default async function Dashboard() {
  const { session } = await requireAuth("/dashboard/guide");

  const lang = (session?.user as { language?: string } | undefined)?.language ?? "ja_JP";
  const dict = await getDictionary(lang, "guide");

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader title={dict.title} dictKey="guide" entryKey="title" />
      <div className="flex-1 overflow-hidden">
        <GuideContent initialDict={dict} />
      </div>
    </div>
  );
}
