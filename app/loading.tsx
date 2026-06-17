"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"

export default function Loading() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-6 bg-linear-to-br from-indigo-50 via-slate-50 to-blue-50 p-4 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900 transition-colors duration-500">
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
