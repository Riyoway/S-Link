"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, MapPin } from "lucide-react";
import { EventDay } from "@/app/actions/schedule";
import { format } from "date-fns";
import { ja, enUS } from "date-fns/locale";

type UpcomingEventsWidgetProps = {
  events: { date: Date; event: EventDay }[];
  dict?: any;
  lang?: string;
};

export function UpcomingEventsWidget({ events, dict, lang }: UpcomingEventsWidgetProps) {
  const currentLocale = lang === "en_US" ? enUS : ja;

  if (!events || events.length === 0) {
    return (
      <Card className="h-full border-border/60 shadow-sm hover:shadow-md transition-all flex flex-col">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            {dict?.title || "Upcoming Events"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center text-muted-foreground text-sm py-8">
          {dict?.empty || "No upcoming events"}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-border/60 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          {dict?.title || "Upcoming Events"}
        </CardTitle>
      </CardHeader>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-0">
            {events.map((item, idx) => {
              const isHoliday = item.event.hex === "#eb4034" || 
                               item.event.event?.includes("休日") || 
                               item.event.event?.includes("休講");
              
              const dateStr = format(item.date, "M/d");
              const weekStr = format(item.date, "(E)", { locale: currentLocale });

              // Move schedule days mapping
              const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
              const weekDaysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              
              const isJa = lang !== "en_US";
              const dayName = isJa ? weekDays[item.event.move_schedule!] : weekDaysEn[item.event.move_schedule!];

              return (
                <div 
                  key={idx} 
                  className="p-3 border-b last:border-0 hover:bg-muted/30 transition-colors flex items-start gap-3"
                >
                  <div className="flex flex-col items-center justify-center min-w-12 bg-muted/30 rounded-md py-1 px-2 border">
                    <span className="text-xs font-bold">{dateStr}</span>
                    <span className={`text-[10px] ${isHoliday ? "text-red-500" : "text-muted-foreground"}`}>
                      {weekStr}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-sm font-medium leading-tight truncate">
                      {item.event.event}
                    </p>
                    {item.event.supplement && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {item.event.supplement}
                      </p>
                    )}
                    {item.event.move_schedule && (
                      <Badge variant="outline" className="mt-1 text-[10px] h-4 px-1 gap-1">
                        <MapPin className="h-2 w-2" />
                        {dayName}{dict?.class_day_suffix || " Schedule"}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
