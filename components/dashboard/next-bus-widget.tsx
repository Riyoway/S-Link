"use client";

import { useEffect, useState } from "react";
import { BusRoute } from "@/types/bus";
import { calculateNextBuses, isPriorityTime } from "@/lib/bus-logic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type NextBusWidgetProps = {
  routes: BusRoute[];
  userCommuteMethod?: number; // 3 = Dorm
  dict?: any;
};

export function NextBusWidget({ routes, userCommuteMethod, dict }: NextBusWidgetProps) {
  const [nextBus, setNextBus] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<BusRoute | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000); // 1 sec update
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Logic from bus-dashboard.tsx: Sort and pick best route
    const sorted = [...routes].sort((a, b) => {
      // Dorm check
      const isADorm = a.meta.routeId === "nabari-yurigaoka-dormitory";
      const isBDorm = b.meta.routeId === "nabari-yurigaoka-dormitory";
      if (userCommuteMethod !== 3) {
        if (isADorm) return 1;
        if (isBDorm) return -1;
      } else {
        if (isADorm) return -1; // Prioritize dorm if dorm student
        if (isBDorm) return 1;
      }
      
      // Priority check
      const isAPriority = isPriorityTime(a.meta.priority, currentTime);
      const isBPriority = isPriorityTime(b.meta.priority, currentTime);
      if (isAPriority && !isBPriority) return -1;
      if (!isAPriority && isBPriority) return 1;
      return 0;
    });

    // Filter logic
    const filtered = sorted.filter(r => {
        if (r.meta.routeId === "nabari-yurigaoka-dormitory") {
             return userCommuteMethod === 3;
        }
        return true;
    });

    const targetRoute = filtered[0];
    if (!targetRoute) return;

    setRouteInfo(targetRoute);

    const buses = calculateNextBuses(targetRoute, currentTime, 1);
    if (buses.length > 0) {
      setNextBus(buses[0]);
    } else {
      setNextBus(null);
    }

  }, [routes, currentTime, userCommuteMethod]);

  if (!routeInfo) return null;

  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Bus className="h-4 w-4" />
                {dict?.title || "Next Bus"}
            </div>
            {isPriorityTime(routeInfo.meta.priority, currentTime) && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1">{dict?.priority || "Priority"}</Badge>
            )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
            <div>
                <p className="font-bold text-base flex items-center gap-1 mb-1">
                    {routeInfo.meta.from} <ArrowRight className="h-3 w-3 text-muted-foreground" /> {routeInfo.meta.to}
                </p>
                {nextBus ? (
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tighter">
                            {String(nextBus.hour).padStart(2, "0")}:{String(nextBus.minute).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {(dict?.remaining || "Starts in {min} min").replace("{min}", nextBus.remainingTime)}
                        </span>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">{dict?.finished || "No more buses today"}</p>
                )}
            </div>
            
            {nextBus && (
                <Badge variant={nextBus.serviceType === "temporary" ? "destructive" : "outline"} className="mb-1">
                    {nextBus.serviceType === "temporary" ? (dict?.temporary || "Temp") : (dict?.normal || "Regular")}
                </Badge>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
