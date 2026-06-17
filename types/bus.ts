export type Priority = {
  start: string; // HH:MM
  end: string;   // HH:MM
} | null;

export type BusMeta = {
  routeId: string;
  displayName: string;
  from: string;
  to: string;
  direction: "outbound" | "inbound";
  labels: string[];
  priority: Priority;
  dev: {
    lastUpdated: string;
  };
};

export type Timetable = {
  [hour: string]: number[];
};

export type Service = {
  serviceType: "regular" | "temporary";
  timetables: {
    weekdays: Timetable;
    weekends: Timetable;
  };
};

export type BusRoute = {
  meta: BusMeta;
  services: Service[];
};

export type BusSchedule = {
  route: BusRoute;
  nextBus: NextBusInfo | null;
  upcomingBuses: NextBusInfo[];
};

export type NextBusInfo = {
  hour: number;
  minute: number;
  remainingTime: number; // minutes
  serviceType: "regular" | "temporary";
  isTomorrow?: boolean;
};
