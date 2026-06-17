"use client"

import { useState, useEffect, useCallback, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, FileText, Menu, PanelLeftClose, PanelLeft } from "lucide-react"
import { createMemo, updateMemo, deleteMemo, type Memo } from "@/app/actions/memo"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAppearance } from "@/components/appearance-provider"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
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
} from "@/components/ui/alert-dialog"

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export function MemoApp({ initialMemos, dict: serverDict, lang = "ja_JP" }: { initialMemos: Memo[], dict: any, lang?: string }) {
  const { dictionaries, language } = useAppearance()
  const dict = dictionaries?.memo || serverDict;

  const [memos, setMemos] = useState<Memo[]>(initialMemos)
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(
    initialMemos.length > 0 ? initialMemos[0].id : null
  )
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Format locale for date
  const dateLocale = (language || lang).replace('_', '-')

  // Content state for immediate feedback
  const [currentTitle, setCurrentTitle] = useState("")
  const [currentContent, setCurrentContent] = useState("")
  const [lastSavedContent, setLastSavedContent] = useState("")
  const [lastSavedTitle, setLastSavedTitle] = useState("")

  const router = useRouter()

  const selectedMemo = memos.find((m) => m.id === selectedMemoId)

  // Initialize inputs when selection changes
  // [FIX] Removed 'memos' from dependency array to prevent editor content reset during auto-save.
  // Including 'memos' caused a feedback loop where saving updated 'memos', which then
  // reset 'currentContent', interrupting IME composition and causing double inputs.
  useEffect(() => {
    if (selectedMemo) {
      setCurrentTitle(selectedMemo.title)
      setCurrentContent(selectedMemo.content)
      setLastSavedTitle(selectedMemo.title)
      setLastSavedContent(selectedMemo.content)
    } else {
      setCurrentTitle("")
      setCurrentContent("")
      setLastSavedTitle("")
      setLastSavedContent("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMemoId]) 

  const currentSize = new Blob([currentContent]).size
  const isOverLimit = currentSize > MAX_SIZE_BYTES
  const sizePercentage = Math.min((currentSize / MAX_SIZE_BYTES) * 100, 100)
  
  // Refs for auto-save (to access latest state in effects/listeners)
  const titleRef = useRef(currentTitle)
  const contentRef = useRef(currentContent)
  const idRef = useRef(selectedMemoId)
  const lastSavedTitleRef = useRef(lastSavedTitle)
  const lastSavedContentRef = useRef(lastSavedContent)

  // Update refs on every render
  useEffect(() => {
    titleRef.current = currentTitle
    contentRef.current = currentContent
    idRef.current = selectedMemoId
    lastSavedTitleRef.current = lastSavedTitle
    lastSavedContentRef.current = lastSavedContent
  })

  // Core save logic that reads from refs
  const performSave = useCallback(async () => {
    const id = idRef.current
    const title = titleRef.current
    const content = contentRef.current
    const lastTitle = lastSavedTitleRef.current
    const lastContent = lastSavedContentRef.current

    if (!id) return
    if (title === lastTitle && content === lastContent) return

    // Check limit (using ref content size estimate)
    const size = new Blob([content]).size
    if (size > MAX_SIZE_BYTES) return // Fail silently on auto-save if over limit

    try {
      await updateMemo(id, title, content)
      
      // Update last saved state locally to avoid double saves
      // Note: We can't easily update state if component is unmounting, 
      // but strictly for "switch" cases, it helps.
      setLastSavedTitle(title)
      setLastSavedContent(content)
      
      // Update the memos list
      setMemos((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, title, content, updated_at: new Date().toISOString() }
            : m
        )
      )
      router.refresh()
    } catch (error) {
      console.error("Auto-save failed", error)
    }
  }, [router])

  // Save when switching memos (cleanup runs before new memo loads)
  useEffect(() => {
    return () => {
      performSave()
    }
  }, [selectedMemoId, performSave])

  // Save on window close / tab hide
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        performSave()
      }
    }
    
    // pagehide is more reliable for mobile browsers on close
    const handlePageHide = () => {
      performSave()
    }

    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [performSave])

  const handleCreate = () => {
    startTransition(async () => {
      try {
        const title = dict?.new_memo || "新規メモ";
        const newMemo = await createMemo(title)
        setMemos([newMemo, ...memos])
        setSelectedMemoId(newMemo.id)
        toast.success(dict?.create_success || "メモを作成しました")
        router.refresh()
      } catch (error) {
        toast.error(dict?.create_error || "メモの作成に失敗しました")
      }
    })
  }

  const handleDelete = () => {
    if (!selectedMemoId) return

    startTransition(async () => {
      try {
        await deleteMemo(selectedMemoId)
        const newMemos = memos.filter((m) => m.id !== selectedMemoId)
        setMemos(newMemos)
        setSelectedMemoId(newMemos.length > 0 ? newMemos[0].id : null)
        toast.success(dict?.delete_success || "メモを削除しました")
        router.refresh()
      } catch (error) {
        toast.error(dict?.delete_error || "メモの削除に失敗しました")
      }
    })
  }

  // Simple Markdown-like Preview Renderer
  const renderPreview = (text: string) => {
    if (!text) return <p className="text-muted-foreground text-sm">{dict?.no_content || "本文がありません"}</p>

    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-2 border-b pb-1">{line.slice(2)}</h1>
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-2">{line.slice(3)}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mb-1">{line.slice(4)}</h3>
      }
      return <p key={index} className="min-h-[1.5em] mb-1">{line}</p>
    })
  }

  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit")

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row gap-4 p-4">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden mb-2">
        <Button variant="outline" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full">
          {isSidebarOpen ? <PanelLeftClose className="mr-2 h-4 w-4" /> : <PanelLeft className="mr-2 h-4 w-4" />}
          {isSidebarOpen ? (dict?.list_close || "リストを閉じる") : (dict?.list_open || "リストを表示")}
        </Button>
      </div>

      {/* Sidebar List */}
      <div className={cn(
        "w-full md:w-64 flex-col gap-2 transition-all duration-300 ease-in-out shrink-0",
        isSidebarOpen ? "flex" : "hidden md:flex md:w-0 md:opacity-0 md:overflow-hidden"
      )}>
        <Card className="flex flex-col h-full border-none shadow-md bg-muted/30">
          <CardHeader className="p-4 pb-2">
            <Button onClick={handleCreate} disabled={isPending} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {dict?.new_memo || "新規メモ"}
            </Button>
          </CardHeader>
          <CardContent className="p-2 flex-1 overflow-y-auto">
            <div className="space-y-1">
              {memos.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  {dict?.no_memos || "メモがありません"}
                </div>
              ) : (
                memos.map((memo) => (
                  <button
                    key={memo.id}
                    onClick={() => {
                      setSelectedMemoId(memo.id)
                      if (window.innerWidth < 768) setIsSidebarOpen(false)
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-md text-sm transition-colors hover:bg-muted group",
                      selectedMemoId === memo.id ? "bg-background shadow-sm border border-border" : "border border-transparent"
                    )}
                  >
                    <div className="font-medium truncate">{memo.title || (dict?.untitled || "無題のメモ")}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                      <span>{new Date(memo.updated_at).toLocaleDateString(dateLocale)}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {new Date(memo.updated_at).toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Editor */}
      <div className="flex-1 min-w-0">
        <Card className="h-full flex flex-col border-none shadow-lg">
          {selectedMemoId ? (
            <>
              <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2 flex-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title={isSidebarOpen ? (dict?.list_close || "リストを閉じる") : (dict?.list_open || "リストを開く")}
                  >
                    {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
                  </Button>
                  <Input
                    value={currentTitle}
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    placeholder={dict?.title_placeholder || "タイトルを入力"}
                    className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 px-2 h-auto"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("edit")}
                      className={cn(
                        "h-7 text-xs rounded-md transition-all font-medium",
                        viewMode === "edit"
                          ? "bg-background/50 shadow-inner text-foreground ring-1 ring-inset ring-black/5 dark:ring-white/5"
                          : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                      )}
                    >
                      {dict?.edit || "編集"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("preview")}
                      className={cn(
                        "h-7 text-xs rounded-md transition-all font-medium",
                        viewMode === "preview"
                          ? "bg-background/50 shadow-inner text-foreground ring-1 ring-inset ring-black/5 dark:ring-white/5"
                          : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                      )}
                    >
                      {dict?.preview || "プレビュー"}
                    </Button>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" title={dict?.delete || "削除"}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{dict?.delete || "削除"}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {dict?.delete_confirm || "このメモを削除してもよろしいですか？"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{dict?.cancel || "キャンセル"}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
                          {dict?.delete_execute || "削除する"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col min-h-0 relative">
                {/* Progress bar for size */}
                <div className="h-1 w-full bg-secondary">
                  <div
                    className={cn("h-full transition-all duration-500",
                      isOverLimit ? "bg-destructive" : "bg-primary"
                    )}
                    style={{ width: `${sizePercentage}%` }}
                  />
                </div>

                {viewMode === "edit" ? (
                  <Textarea
                    value={currentContent}
                    onChange={(e) => setCurrentContent(e.target.value)}
                    placeholder={dict?.input_placeholder || "メモを入力... (# で見出しサイズを変更できます)"}
                    className="flex-1 resize-none border-none shadow-none focus-visible:ring-0 p-4 text-base leading-relaxed"
                  />
                ) : (
                  <div className="flex-1 p-6 overflow-y-auto prose dark:prose-invert max-w-none">
                    {renderPreview(currentContent)}
                  </div>
                )}
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FileText className="h-16 w-16 mb-4 opacity-20" />
              <p>{dict?.select_memo || "メモを選択するか、新しく作成してください"}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
