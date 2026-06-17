"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CalendarMonthProps {
  month: number
  data: any[]
  onDateClick: (dayData: any) => void
  dict: any
}

// Define weekdays order for logic (matching data)
const weekdayKeys = ["日", "月", "火", "水", "木", "金", "土"]

export function CalendarMonth({ month, data, onDateClick, dict }: CalendarMonthProps) {
  // Calculate empty cells for start of month
  // We need to find the weekday of the first day to align the grid correctly
  // The data array starts from day 1, so data[0] is the 1st of the month
  const firstDayWeekday = data[0]?.weekday
  const firstDayIndex = weekdayKeys.indexOf(firstDayWeekday)
  
  const emptyCells = Array(firstDayIndex === -1 ? 0 : firstDayIndex).fill(null)

  // Calculate empty cells for end of month to fill the grid
  const totalCells = emptyCells.length + data.length
  const remainder = totalCells % 7
  const trailingEmptyCells = Array(remainder === 0 ? 0 : 7 - remainder).fill(null)

  const getTerm = (key: string) => dict.terms?.[key] || key

  // Get month title from dictionary (array) or fallback to suffix
  const monthTitle = dict.ui.months?.[month - 1] || `${month}${dict.ui.month_suffix}`

  // Get display weekdays from dictionary or fallback to keys
  const displayWeekdays = dict.ui.weekdays || weekdayKeys

  return (
    <Card className="h-full border shadow-sm overflow-hidden bg-card">
      <CardHeader className="py-3 px-0 border-b bg-muted/20">
        <CardTitle className="text-center text-lg font-bold">{monthTitle}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-b bg-muted/5">
          {displayWeekdays.map((wd: string, i: number) => (
            <div key={i} className={cn("py-2 text-center text-xs font-medium text-muted-foreground", i === 0 && "text-red-500", i === 6 && "text-blue-500")}>
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-border border-b">
          {emptyCells.map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-card" />
          ))}
          {data.map((dayData, i) => {
            const hasEvent = !!dayData.event
            const hasSupplement = !!dayData.supplement
            const hexColor = dayData.hex
            const isSunday = dayData.weekday === "日"
            const isSaturday = dayData.weekday === "土"
            const isExam = dayData.isExam

            return (
              <button
                key={i}
                onClick={() => onDateClick(dayData)}
                className={cn(
                  "relative aspect-square p-1 flex flex-col items-center justify-start transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary z-10 bg-card",
                  // No specific border logic needed as gap-px handles the grid lines
                )}
              >

                {
                  isExam && (
                    // isExamがTrueの部分を薄い黄色で塗りつぶす
                    <div className="absolute top-0 left-0 w-full h-full bg-yellow-500/20"></div>
                  )
                }
                <span 
                  className={cn(
                    "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1",
                    isSunday && "text-red-500",
                    isSaturday && "text-blue-500",
                  )}
                  style={hexColor ? { color: hexColor } : {}}
                >
                  {dayData.day}
                </span>
                
                <div className="flex flex-wrap justify-center gap-1 w-full px-1">
                  {hasEvent && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" title={getTerm(dayData.event)} />
                  )}
                  {hasSupplement && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" title={Array.isArray(dayData.supplement) ? dayData.supplement.map((s: string) => getTerm(s)).join(', ') : getTerm(dayData.supplement)} />
                  )}
                </div>
              </button>
            )
          })}
          {trailingEmptyCells.map((_, i) => (
            <div key={`trailing-${i}`} className="aspect-square bg-card" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
