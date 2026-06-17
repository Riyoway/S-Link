import { BusRoute, Service, NextBusInfo, Timetable } from "@/types/bus";

export function isWeekend(date: Date = new Date()): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function getCurrentTimeInfo(date: Date = new Date()) {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
    totalMinutes: date.getHours() * 60 + date.getMinutes(),
  };
}

export function getTimetableForDate(
  service: Service,
  date: Date = new Date(),
): Timetable {
  // Return empty if weekend to prevent misleading data (user request)
  if (isWeekend(date)) return {};

  if (!service?.timetables) return {};
  const target = service.timetables.weekdays;
  return target || {};
}

export function calculateNextBuses(
  route: BusRoute,
  date: Date = new Date(),
  limit: number = 5,
): NextBusInfo[] {
  const {
    hour: currentHour,
    minute: currentMinute,
    totalMinutes: currentTotalMinutes,
  } = getCurrentTimeInfo(date);
  const nextBuses: NextBusInfo[] = [];

  const candidates: {
    hour: number;
    minute: number;
    serviceType: "regular" | "temporary";
    totalMinutes: number;
  }[] = [];

  route.services.forEach((service) => {
    const timetable = getTimetableForDate(service, date);
    Object.entries(timetable).forEach(([hStr, minutes]) => {
      const h = parseInt(hStr, 10);
      minutes.forEach((m) => {
        candidates.push({
          hour: h,
          minute: m,
          serviceType: service.serviceType,
          totalMinutes: h * 60 + m,
        });
      });
    });
  });

  // Sort by time
  candidates.sort((a, b) => a.totalMinutes - b.totalMinutes);

  // Find future buses
  for (const bus of candidates) {
    if (bus.totalMinutes >= currentTotalMinutes) {
      nextBuses.push({
        hour: bus.hour,
        minute: bus.minute,
        remainingTime: bus.totalMinutes - currentTotalMinutes,
        serviceType: bus.serviceType,
        isTomorrow: false,
      });
      if (nextBuses.length >= limit) break;
    }
  }

  // If we need more buses, look at tomorrow (simplified: just assume weekday schedule for tomorrow for now)
  // TODO: Better tomorrow handling based on actual date
  if (nextBuses.length < limit) {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Recalculate candidates for tomorrow
    const tomorrowCandidates: typeof candidates = [];
    route.services.forEach((service) => {
      const timetable = getTimetableForDate(service, tomorrow);
      Object.entries(timetable).forEach(([hStr, minutes]) => {
        const h = parseInt(hStr, 10);
        minutes.forEach((m) => {
          tomorrowCandidates.push({
            hour: h,
            minute: m,
            serviceType: service.serviceType,
            totalMinutes: h * 60 + m,
          });
        });
      });
    });
    tomorrowCandidates.sort((a, b) => a.totalMinutes - b.totalMinutes);

    for (const bus of tomorrowCandidates) {
      nextBuses.push({
        hour: bus.hour,
        minute: bus.minute,
        remainingTime: bus.totalMinutes + 24 * 60 - currentTotalMinutes,
        serviceType: bus.serviceType,
        isTomorrow: true,
      });
      if (nextBuses.length >= limit) break;
    }
  }

  return nextBuses;
}

export type DailyBusInfo = {
  hour: number;
  minute: number;
  totalMinutes: number;
  serviceType: "regular" | "temporary";
  isPast: boolean;
  minutesUntil: number;
};

export function getDailySchedule(
  route: BusRoute,
  date: Date = new Date(),
): DailyBusInfo[] {
  const { totalMinutes: currentTotalMinutes } = getCurrentTimeInfo(date);
  const candidates: DailyBusInfo[] = [];

  route.services.forEach((service) => {
    const timetable = getTimetableForDate(service, date);
    Object.entries(timetable).forEach(([hStr, minutes]) => {
      const h = parseInt(hStr, 10);
      minutes.forEach((m) => {
        const totalMinutes = h * 60 + m;
        candidates.push({
          hour: h,
          minute: m,
          totalMinutes: totalMinutes,
          serviceType: service.serviceType,
          isPast: totalMinutes < currentTotalMinutes,
          minutesUntil: totalMinutes - currentTotalMinutes,
        });
      });
    });
  });

  // Sort by time
  candidates.sort((a, b) => a.totalMinutes - b.totalMinutes);

  return candidates;
}

export function isPriorityTime(
  priority: { start: string; end: string } | null,
  date: Date = new Date(),
): boolean {
  if (!priority) return false;

  const { totalMinutes } = getCurrentTimeInfo(date);

  const [startH, startM] = priority.start.split(":").map(Number);
  const [endH, endM] = priority.end.split(":").map(Number);

  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;

  // Handle overnight range (e.g. 23:00 - 01:00) though not used in current JSONs
  if (startTotal > endTotal) {
    return totalMinutes >= startTotal || totalMinutes <= endTotal;
  }

  return totalMinutes >= startTotal && totalMinutes <= endTotal;
}
