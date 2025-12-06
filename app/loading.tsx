"use client"

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

export default function Loading() {
  const [progress, setProgress] = useState(13)

  useEffect(() => {
    // ダミーの進行状況シミュレーション
    const timer1 = setTimeout(() => setProgress(45), 200)
    const timer2 = setTimeout(() => setProgress(80), 500)
    const timer3 = setTimeout(() => setProgress(100), 1200)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-6 bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 p-4 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
      <div className="w-full max-w-md space-y-4 text-center animate-in fade-in zoom-in-95 duration-700">
        <h2 className="text-xl font-bold tracking-tight text-slate-700 dark:text-slate-200 animate-pulse">
          S-Link Loading...
        </h2>
        <Progress value={progress} className="w-full h-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          読み込み中...
        </p>
      </div>
    </div>
  )
}
