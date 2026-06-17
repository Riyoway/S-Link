"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CloudSun, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type WeatherData = {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
};

type WeatherWidgetProps = {
  dict?: any;
};

const WEATHER_ICONS: Record<number, { icon: any; color: string }> = {
  0: { icon: Sun, color: "text-orange-500" },
  1: { icon: Sun, color: "text-orange-400" },
  2: { icon: CloudSun, color: "text-yellow-500" },
  3: { icon: Cloud, color: "text-gray-500" },
  45: { icon: Cloud, color: "text-gray-400" },
  48: { icon: Cloud, color: "text-gray-400" },
  51: { icon: CloudRain, color: "text-blue-400" },
  53: { icon: CloudRain, color: "text-blue-500" },
  55: { icon: CloudRain, color: "text-blue-600" },
  61: { icon: CloudRain, color: "text-blue-400" },
  63: { icon: CloudRain, color: "text-blue-500" },
  65: { icon: CloudRain, color: "text-blue-600" },
  71: { icon: CloudSnow, color: "text-cyan-400" },
  73: { icon: CloudSnow, color: "text-cyan-500" },
  75: { icon: CloudSnow, color: "text-cyan-600" },
  95: { icon: CloudLightning, color: "text-purple-500" },
};

export function WeatherWidget({ dict }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Nabari City Coordinates
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=34.626&longitude=136.094&current=temperature_2m,weather_code&timezone=Asia%2FTokyo"
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return null; // Hide if error
  }

  const code = weather.current.weather_code;
  const temp = weather.current.temperature_2m;
  
  const iconInfo = WEATHER_ICONS[code] || { icon: Cloud, color: "text-gray-500" };
  const Icon = iconInfo.icon;
  
  const label = dict?.labels?.[String(code)] || dict?.unknown || "Unknown";

  return (
    <Card className="h-full border-border/60 shadow-sm hover:shadow-md transition-all overflow-hidden relative">
      <CardContent className="p-4 flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
             {dict?.location || "Nabari, Mie"}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold tracking-tighter">
              {Math.round(temp)}°
            </span>
            <span className="text-sm font-medium text-muted-foreground mb-1">
              {label}
            </span>
          </div>
        </div>
        <div className={cn("p-2 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm", iconInfo.color)}>
          <Icon className="h-8 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}
