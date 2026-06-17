"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database, FileText, CheckSquare, AlertCircle } from "lucide-react";
import { DashboardStats } from "@/app/actions/dashboard";

type StorageWidgetProps = {
  stats: DashboardStats;
  dict?: any;
};

export function StorageWidget({ stats, dict }: StorageWidgetProps) {
  const percentage = Math.min(100, (stats.storageUsage / stats.storageLimit) * 100);
  const isHigh = percentage > 80;
  
  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <Card className="h-full border-border/60 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Database className="h-4 w-4" />
          {dict?.title || "Storage Usage"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold">{formatBytes(stats.storageUsage)}</span>
            <span className="text-muted-foreground">/ {formatBytes(stats.storageLimit)}</span>
          </div>
          <Progress value={percentage} className={isHigh ? "bg-red-100 dark:bg-red-900/20 [&>div]:bg-red-500" : ""} />
          {isHigh && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {dict?.alert || "Storage is running low"}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
            <FileText className="h-5 w-5 mb-1 text-blue-500" />
            <span className="text-2xl font-bold">{stats.memoCount}</span>
            <span className="text-xs text-muted-foreground">{dict?.memo || "Memos"}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
            <CheckSquare className="h-5 w-5 mb-1 text-green-500" />
            <span className="text-2xl font-bold">{stats.todoCount}</span>
            <span className="text-xs text-muted-foreground">{dict?.todo || "Todos"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
