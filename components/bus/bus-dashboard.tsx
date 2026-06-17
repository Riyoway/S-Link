"use client";

import { useState, useEffect, useRef } from "react";
import { BusRoute, NextBusInfo, BusSchedule } from "@/types/bus";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculateNextBuses,
  isPriorityTime,
  getCurrentTimeInfo,
  getDailySchedule,
  DailyBusInfo,
} from "@/lib/bus-logic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Bus,
  ArrowRight,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAppearance } from "@/components/appearance-provider";

interface BusDashboardProps {
  initialRoutes: BusRoute[];
  userCommuteMethod?: number;
  dict: any;
  lang?: string;
}

export function BusDashboard({
  initialRoutes,
  userCommuteMethod,
  dict,
  lang = "ja_JP",
}: BusDashboardProps) {
  const { dictionaries } = useAppearance();
  const busDict = dictionaries?.bus || dict;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sortedRoutes, setSortedRoutes] = useState<BusRoute[]>([]);
  const [priorityRoute, setPriorityRoute] = useState<BusRoute | null>(null);
  const [schedules, setSchedules] = useState<Map<string, DailyBusInfo[]>>(
    new Map(),
  );

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sort routes and calculate schedules
  useEffect(() => {
    const sorted = [...initialRoutes].sort((a, b) => {
      // 1. Dormitory check
      const isADorm = a.meta.routeId === "nabari-yurigaoka-dormitory";
      const isBDorm = b.meta.routeId === "nabari-yurigaoka-dormitory";

      if (userCommuteMethod !== 3) {
        if (isADorm) return 1;
        if (isBDorm) return -1;
      } else {
        if (isADorm) return 1;
        if (isBDorm) return -1;
      }

      // 2. Priority check
      const isAPriority = isPriorityTime(a.meta.priority, currentTime);
      const isBPriority = isPriorityTime(b.meta.priority, currentTime);

      if (isAPriority && !isBPriority) return -1;
      if (!isAPriority && isBPriority) return 1;

      return 0;
    });

    const filtered = sorted.filter((r) => {
      if (r.meta.routeId === "nabari-yurigaoka-dormitory") {
        return userCommuteMethod === 3;
      }
      return true;
    });

    setSortedRoutes(filtered);

    const currentPriority = filtered.find((r) =>
      isPriorityTime(r.meta.priority, currentTime),
    );
    setPriorityRoute(currentPriority || filtered[0] || null);

    const newSchedules = new Map<string, DailyBusInfo[]>();
    filtered.forEach((route) => {
      newSchedules.set(
        route.meta.routeId,
        getDailySchedule(route, currentTime),
      );
    });
    setSchedules(newSchedules);
  }, [initialRoutes, currentTime, userCommuteMethod]);

  return (
    <div className="space-y-6 p-4 pb-20">
      {/* Top Priority Section */}
      {priorityRoute && (
        <PriorityBusDisplay
          route={priorityRoute}
          schedule={schedules.get(priorityRoute.meta.routeId) || []}
          dict={busDict}
        />
      )}

      {/* List of all routes */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold px-1">
          {busDict?.timetable || "時刻表"}
        </h2>
        {sortedRoutes.map((route) => (
          <BusRouteCard
            key={route.meta.routeId}
            route={route}
            schedule={schedules.get(route.meta.routeId) || []}
            dict={busDict}
            isPriority={route.meta.routeId === priorityRoute?.meta.routeId}
          />
        ))}
      </div>
    </div>
  );
}

function PriorityBusDisplay({
  route,
  schedule,
  dict,
}: {
  route: BusRoute;
  schedule: DailyBusInfo[];
  dict: any;
}) {
  if (schedule.length === 0) return null;

  // Use -5 minutes buffer to find "active" bus
  const nextBusIndex = schedule.findIndex((b) => b.minutesUntil >= -5);

  if (nextBusIndex === -1) {
    return (
      <Card className="bg-linear-to-br from-primary/10 to-background border-primary/20 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Bus className="h-6 w-6 text-primary" />
                {route.meta.displayName}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          {dict?.no_schedule || "本日の運行は終了しました"}
        </CardContent>
      </Card>
    );
  }

  const prevBus = nextBusIndex > 0 ? schedule[nextBusIndex - 1] : null;
  const nextBus = schedule[nextBusIndex];
  const nextNextBus =
    nextBusIndex + 1 < schedule.length ? schedule[nextBusIndex + 1] : null;

  const getBusId = (bus: DailyBusInfo) => 
    `${route.meta.routeId}-${bus.hour}-${bus.minute}-${bus.serviceType}`;

  return (
    <Card className="bg-muted/40 border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Bus className="h-6 w-6 text-primary" />
              {route.meta.displayName}
            </CardTitle>

            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1">
              {route.meta.from}
              <ArrowRight className="h-3 w-3" />
              {route.meta.to}
            </p>
          </div>

          {isPriorityTime(route.meta.priority) && (
            <Badge
              variant="secondary"
              className="text-xs"
            >
              {dict?.priority_schedule || "優先表示"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center py-4 space-y-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {/* Previous Bus */}
            {prevBus && (
              <motion.div
                key={getBusId(prevBus)}
                layoutId={getBusId(prevBus)}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="w-full"
              >
                <div className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 rounded-lg border">
                  <span className="text-sm font-medium text-muted-foreground">
                    {dict?.previous_bus || "前のバス"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      {String(prevBus.hour).padStart(2, "0")}:
                      {String(prevBus.minute).padStart(2, "0")}
                    </span>
                    <Badge variant="outline" className="text-[10px] h-5">
                      {prevBus.serviceType === "temporary"
                        ? dict?.temporary || "臨時"
                        : dict?.regular || "通常"}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Main Next Bus Display */}
            <motion.div
              key={getBusId(nextBus)}
              layoutId={getBusId(nextBus)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full relative z-10"
            >
              {(() => {
                const m = nextBus.minutesUntil;
                let cardClass = "text-center w-full bg-card rounded-xl p-6 border shadow-sm relative overflow-hidden ring-4 ring-primary/5 transition-colors duration-300";
                let timeClass = "text-6xl font-black tracking-tighter tabular-nums my-2 transition-colors duration-300";
                
                if (m < 0) {
                  // Delayed / Arriving (within 5 mins after)
                  cardClass = "text-center w-full bg-orange-500/10 rounded-xl p-6 border-orange-500 border shadow-sm relative overflow-hidden ring-4 ring-orange-500/20";
                  timeClass += " text-orange-600 dark:text-orange-400";
                } else if (m < 1) {
                  // < 1 min (Approaching now!)
                  cardClass = "text-center w-full bg-destructive/10 rounded-xl p-6 border-destructive border shadow-sm relative overflow-hidden ring-4 ring-destructive/20";
                  timeClass += " text-destructive animate-pulse";
                } else if (m < 2) {
                  // < 2 mins
                  cardClass = "text-center w-full bg-green-500/10 rounded-xl p-6 border-green-500 border shadow-sm relative overflow-hidden ring-4 ring-green-500/20";
                  timeClass += " text-green-600 dark:text-green-400";
                } else if (m < 5) {
                  // < 5 mins
                  cardClass = "text-center w-full bg-yellow-500/10 rounded-xl p-6 border-yellow-500 border shadow-sm relative overflow-hidden ring-4 ring-yellow-500/20";
                  timeClass += " text-yellow-600 dark:text-yellow-400";
                }

                return (
                  <div className={cardClass}>
                    <div className="absolute top-0 right-0 p-2">
                      <Badge
                        variant={
                          nextBus.serviceType === "temporary"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {nextBus.serviceType === "temporary"
                          ? dict?.temporary || "臨時"
                          : dict?.regular || "通常"}
                      </Badge>
                    </div>

                    <div className={timeClass}>
                      {String(nextBus.hour).padStart(2, "0")}:
                      {String(nextBus.minute).padStart(2, "0")}
                    </div>

                    <CountdownTimer
                      minutesUntil={nextBus.minutesUntil}
                      dict={dict}
                      isMain={true}
                    />
                  </div>
                );
              })()}
            </motion.div>

            {/* Next Next Bus */}
            {nextNextBus && (
              <motion.div
                key={getBusId(nextNextBus)}
                layoutId={getBusId(nextNextBus)}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="w-full"
              >
                <div className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 rounded-lg border">
                  <span className="text-sm font-medium text-muted-foreground">
                    {dict?.next_bus || "次のバス"}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">
                      {String(nextNextBus.hour).padStart(2, "0")}:
                      {String(nextNextBus.minute).padStart(2, "0")}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] h-5",
                        nextNextBus.serviceType === "temporary"
                          ? "text-destructive border-destructive"
                          : "",
                      )}
                    >
                      {nextNextBus.serviceType === "temporary"
                        ? dict?.temporary || "臨時"
                        : dict?.regular || "通常"}
                    </Badge>
                    <div className="text-xs text-muted-foreground w-16 text-right">
                      {/* Simple approximation for next next bus wait time */}
                      {Math.floor(nextNextBus.minutesUntil / 60) > 0
                        ? `${Math.floor(nextNextBus.minutesUntil / 60)}${dict?.hour || "時間"} ${nextNextBus.minutesUntil % 60}${dict?.minute || "分"}`
                        : `${nextNextBus.minutesUntil}${dict?.minute || "分"}`}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

function BusRouteCard({
  route,
  schedule,
  dict,
  isPriority,
}: {
  route: BusRoute;
  schedule: DailyBusInfo[];
  dict: any;
  isPriority: boolean;
}) {
  // Determine scroll position or highlight active bus
  const activeBusIndex = schedule.findIndex((b) => b.minutesUntil >= -5);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!hasScrolled && activeItemRef.current && scrollContainerRef.current) {
      // Calculate offset to scroll to
      const container = scrollContainerRef.current;
      const item = activeItemRef.current;
      
      const itemTop = item.offsetTop;
      // Scroll so item is at top (or with some padding)
      container.scrollTop = itemTop - 10; // 10px padding
      
      setHasScrolled(true);
    }
  }, [schedule, hasScrolled, activeBusIndex]);

  return (
    <Card
      className={cn("overflow-hidden", isPriority ? "border-primary/50" : "")}
    >
      <CardHeader className="bg-muted/30 py-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-semibold">{route.meta.displayName}</h3>
            <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
              {route.meta.from}
              <ArrowRight className="h-3 w-3" />
              {route.meta.to}
            </p>
          </div>
          {isPriority && (
            <Badge variant="outline" className="text-[10px] h-5 shrink-0">
              {dict?.priority_schedule || "優先"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent 
        ref={scrollContainerRef}
        className="p-0 max-h-96 overflow-y-auto scroll-smooth"
      >
        {schedule.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            {dict?.no_schedule || "本日の運行は終了しました"}
          </div>
        ) : (
          <div className="divide-y relative">
            {schedule.map((bus, idx) => (
              <div 
                key={idx} 
                ref={idx === activeBusIndex ? activeItemRef : null}
              >
                <BusRow bus={bus} dict={dict} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BusRow({ bus, dict }: { bus: DailyBusInfo; dict: any }) {

  let rowClass =
    "flex items-center justify-between p-3 transition-colors hover:bg-muted/50";
  let timeClass = "text-lg font-bold tabular-nums";
  let statusColor = "";

  const m = bus.minutesUntil;

  if (m < -5) {
    // Passed more than 5 mins ago
    statusColor = "text-muted-foreground/30";
    rowClass += " bg-muted/10";
  } else if (m < 0) {
    // Passed within 5 mins (Delayed / Arriving)
    statusColor = "text-orange-500 font-bold";
    rowClass += " bg-orange-500/10 border-l-4 border-orange-500";
  } else if (m < 1) {
    // < 1 min (Approaching now!)
    statusColor = "text-destructive font-black animate-pulse";
    rowClass += " bg-destructive/10 border-l-4 border-destructive";
  } else if (m < 2) {
    // < 2 mins
    statusColor = "text-green-600 dark:text-green-400 font-bold";
    rowClass += " bg-green-500/10 border-l-4 border-green-500";
  } else if (m < 5) {
    // < 5 mins
    statusColor = "text-yellow-600 dark:text-yellow-400 font-bold";
    rowClass += " bg-yellow-500/10 border-l-4 border-yellow-500";
  } else {
    // Future normal
    statusColor = "";
  }

  return (
    <div className={rowClass}>
      <div className="flex items-center gap-3">
        <div className={cn(timeClass, statusColor)}>
          {String(bus.hour).padStart(2, "0")}:
          {String(bus.minute).padStart(2, "0")}
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] h-5",
            bus.serviceType === "temporary"
              ? "border-destructive text-destructive"
              : "",
            m < -5 ? "opacity-50" : "",
          )}
        >
          {bus.serviceType === "temporary"
            ? dict?.temporary || "臨時"
            : dict?.regular || "通常"}
        </Badge>
      </div>
      <div className={cn("text-sm text-right", statusColor)}>
        {m >= 0 ? (
          <CountdownDisplay minutesUntil={m} dict={dict} />
        ) : m >= -5 ? (
           <span className="font-bold">{dict?.delayed_status || "到着・発車"}</span>
        ) : (
          <span className="text-xs">{dict?.departed || "出発済み"}</span>
        )}
      </div>
    </div>
  );
}

function CountdownTimer({
  minutesUntil,
  dict,
  isMain,
}: {
  minutesUntil: number;
  dict: any;
  isMain: boolean;
}) {
  return (
    <div
      className={cn(
        "font-medium",
        isMain ? "text-lg text-primary" : "text-sm text-muted-foreground",
      )}
    >
      <CountdownDisplay minutesUntil={minutesUntil} dict={dict} />
    </div>
  );
}

function CountdownDisplay({
  minutesUntil,
  dict,
}: {
  minutesUntil: number;
  dict: any;
}) {
  const now = new Date();
  const currentSeconds = now.getSeconds();

  const totalSecondsLeft = minutesUntil * 60 - currentSeconds;

  if (totalSecondsLeft < 0) return <span>{dict?.delayed_status || "到着・発車"}</span>;

  const hours = Math.floor(totalSecondsLeft / 3600);
  const minutes = Math.floor((totalSecondsLeft % 3600) / 60);
  const seconds = totalSecondsLeft % 60;

  // Show seconds if less than 5 minutes (300 seconds)
  if (totalSecondsLeft < 300) {
    return (
      <span>
        {minutes}
        {dict?.minute || "分"} {seconds}
        {dict?.second || "秒"}
      </span>
    );
  }

  if (hours > 0) {
    return (
      <span>
        {hours}
        {dict?.hour || "時間"} {minutes}
        {dict?.minute || "分"}
      </span>
    );
  }

  return (
    <span>
      {minutes}
      {dict?.minute || "分"}
    </span>
  );
}
