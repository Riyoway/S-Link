"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Info, FileText, ArrowRightLeft } from "lucide-react"

interface EventDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  date: string
  event: any
  dict: any
}

// Helper to map data weekday (Japanese) to localized weekday
const jaWeekdays = ["日", "月", "火", "水", "木", "金", "土"]

export function EventDetailDialog({
  isOpen,
  onClose,
  date,
  event,
  dict,
}: EventDetailDialogProps) {
  if (!event) return null

  const hasEvent = !!event.event
  const hasSupplement = !!event.supplement
  const hasMoveSchedule = !!event.move_schedule

  const getTerm = (key: string) => dict.terms?.[key] || key

  const getLocalizedWeekday = (wd: string) => {
    const index = jaWeekdays.indexOf(wd)
    if (index !== -1 && dict.ui.weekdays && dict.ui.weekdays[index]) {
      return dict.ui.weekdays[index]
    }
    return wd
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            {date} ({getLocalizedWeekday(event.weekday)})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {!hasEvent && !hasSupplement && !hasMoveSchedule ? (
             <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-2">
                <Info className="h-12 w-12 opacity-20" />
                <p>{dict.ui.no_events}</p>
             </div>
          ) : (
            <div className="space-y-4">
              {hasEvent && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {dict.ui.event}
                  </h4>
                  <p className="text-lg font-medium pl-6">{getTerm(event.event)}</p>
                </div>
              )}

              {hasMoveSchedule && (
                 <div className="space-y-2">
                   <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                     <ArrowRightLeft className="h-4 w-4" />
                     {dict.ui.move_schedule}
                   </h4>
                   <div className="pl-6">
                     <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
                        {dict.ui.move_schedule}
                     </Badge>
                   </div>
                 </div>
              )}

              {hasSupplement && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    {dict.ui.supplement}
                  </h4>
                  <div className="pl-6">
                    {Array.isArray(event.supplement) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {event.supplement.map((sup: string, i: number) => (
                          <li key={i} className="text-base">{getTerm(sup)}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-base">{getTerm(event.supplement)}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
