import { requireAuth } from "@/lib/auth-guard";
import { PageHeader } from "@/components/page-header";
import { MemoApp } from "@/components/memo/memo-app";
import { getMemos } from "@/app/actions/memo";
import { getDictionary } from "@/lib/dictionaries";

export default async function MemoPage() {
  const { session } = await requireAuth("/dashboard/memo");
  const memos = await getMemos();

  // @ts-ignore
  const lang = session?.user?.language || "ja_JP";
  const dict = await getDictionary(lang, "memo");

  return (
    <>
      <PageHeader title={dict.title || "メモ帳"} dictKey="memo" entryKey="title" />
      <div className="flex-1 overflow-hidden">
        <MemoApp initialMemos={memos} dict={dict} lang={lang} />
      </div>
    </>
  );
}
