"use client"

import { useState, useEffect } from "react"
import { CalendarMonth } from "./calendar-month"
import { EventDetailDialog } from "./event-detail-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useAppearance } from "@/components/appearance-provider"
import { format } from "date-fns"
import { 
  ja, enUS, enGB, enAU, enCA, enIN, enNZ,
  zhCN, zhTW, zhHK, ko,
  es, fr, de, it, ptBR, ru,
  arEG, arSA 
} from "date-fns/locale"
import { Clock } from "lucide-react"

const locales: { [key: string]: any } = {
  ja_JP: ja,
  en_US: enUS,
  en_GB: enGB,
  en_AU: enAU,
  en_CA: enCA,
  en_IN: enIN,
  en_NZ: enNZ,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  "zh-HK": zhHK,
  ko_KR: ko,
  es_ES: es,
  fr_FR: fr,
  de_DE: de,
  it_IT: it,
  pt_BR: ptBR,
  ru_RU: ru,
  ar_EG: arEG,
  ar_SA: arSA,
}

interface EventsAppProps {
  eventsData: {
    sem1: { [key: string]: any[] }
    sem2: { [key: string]: any[] }
  }
  initialDict: any
}

// Custom sort for academic year (4,5,6,7,8,9,10,11,12,1,2,3)
const sortAcademicMonths = (months: string[]) => {
  const order = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3]
  return months.sort((a, b) => {
    return order.indexOf(parseInt(a)) - order.indexOf(parseInt(b))
  })
}

export function EventsApp({ eventsData, initialDict }: EventsAppProps) {
  const { dictionaries, language } = useAppearance()
  const dict = dictionaries.events || initialDict
  const currentLocale = locales[language] || ja

  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDay, setSelectedDay] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // Initialize active tab based on current month
  const [activeTab, setActiveTab] = useState<string>(() => {
    const month = new Date().getMonth() + 1 // 1-12
    return (month >= 4 && month <= 9) ? "sem1" : "sem2"
  })

  // Update current date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const handleDateClick = (dayData: any, month: string) => {
    setSelectedDay({ ...dayData, month })
    setDialogOpen(true)
  }
  
  const sem1Months = sortAcademicMonths(Object.keys(eventsData.sem1))
  const sem2Months = sortAcademicMonths(Object.keys(eventsData.sem2))

  return (
    <div className="space-y-6">
      {/* Top Info Bar */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight">
              {language === "ja_JP" 
                ? format(currentDate, "yyyy年 M月 d日", { locale: currentLocale })
                : format(currentDate, "MMMM d, yyyy", { locale: currentLocale })
              }
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              {format(currentDate, "EEEE", { locale: currentLocale })}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border border-border/50 shadow-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono text-lg font-medium">
              {format(currentDate, "HH:mm", { locale: currentLocale })}
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="sem1">{dict.ui.semester_1}</TabsTrigger>
          <TabsTrigger value="sem2">{dict.ui.semester_2}</TabsTrigger>
        </TabsList>

        <TabsContent value="sem1" className="space-y-8 animate-in fade-in-50 duration-500">
          {sem1Months.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sem1Months.map((month) => (
                <CalendarMonth
                  key={month}
                  month={parseInt(month)}
                  data={eventsData.sem1[month]}
                  onDateClick={(dayData) => handleDateClick(dayData, month)}
                  dict={dict}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p>{dict.ui.no_data}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sem2" className="space-y-8 animate-in fade-in-50 duration-500">
          {sem2Months.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sem2Months.map((month) => (
                <CalendarMonth
                  key={month}
                  month={parseInt(month)}
                  data={eventsData.sem2[month]}
                  onDateClick={(dayData) => handleDateClick(dayData, month)}
                  dict={dict}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p>{dict.ui.no_data}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <EventDetailDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        date={
          selectedDay 
            ? language === "ja_JP"
              ? `${selectedDay.month}${dict.ui.month_suffix}${selectedDay.day}${dict.ui.day_suffix}`
              : `${dict.ui.months?.[parseInt(selectedDay.month) - 1] || selectedDay.month} ${selectedDay.day}`
            : ""
        }
        event={selectedDay}
        dict={dict}
      />
    </div>
  )
}
