"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppearance } from "@/components/appearance-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Search } from "lucide-react";

interface ClassroomSearchProps {
    tool: any;
    onBack: () => void;
}

type LocationData = {
    [building: string]: {
        [floor: string]: string[];
    };
};

type SearchResult = {
    room: string;
    building: string;
    floor: string;
    formattedLocation: string;
};

export function ClassroomSearch({ tool, onBack }: ClassroomSearchProps) {
    const { dictionaries } = useAppearance();
    const dict = dictionaries.tools || {};

    const buildingNames: Record<string, string> = dict.building_names || {
        main_building: "本館",
        building_1: "1号館",
        building_2: "2号館",
        building_3: "3号館",
        building_4: "4号館",
        library: "図書館棟",
        gym: "体育館"
    };
    const floorSuffix = dict.floor_suffix || "階";
    const roomSuffix = dict.room_suffix || "教室";
    const noResults = dict.no_results || "見つかりませんでした";
    const searchPlaceholder = dict.search_placeholder || "検索...";
    const backLabel = dict.back || "戻る";

    const [query, setQuery] = useState("");
    const [locationData, setLocationData] = useState<LocationData | null>(null);

    useEffect(() => {
        fetch("/data/location.json")
            .then(res => res.json())
            .then(data => setLocationData(data))
            .catch(console.error);
    }, []);

    const results = useMemo<SearchResult[]>(() => {
        if (!locationData || !query.trim()) return [];

        const q = query.trim().toLowerCase();
        const matches: SearchResult[] = [];

        for (const [building, floors] of Object.entries(locationData)) {
            for (const [floor, rooms] of Object.entries(floors)) {
                for (const room of rooms) {
                    if (room.toLowerCase().includes(q)) {
                        const buildingName = buildingNames[building] || building;
                        // Add "教室" suffix only if room is purely numeric
                        const isNumericRoom = /^\d+$/.test(room);
                        const roomDisplay = isNumericRoom ? `${room}${roomSuffix}` : room;

                        matches.push({
                            room,
                            building,
                            floor,
                            formattedLocation: `${buildingName} ${floor}${floorSuffix} ${roomDisplay}`
                        });
                    }
                }
            }
        }
        return matches;
    }, [locationData, query, buildingNames, floorSuffix, roomSuffix]);

    return (
        <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
            </Button>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">{tool.title}</h2>
                <p className="text-muted-foreground">{tool.description}</p>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10"
                        autoFocus
                    />
                </div>

                {query.trim() && (
                    <div className="space-y-2">
                        {results.length > 0 ? (
                            results.map((r, i) => (
                                <Card key={i} className="hover:bg-accent/50 transition-colors">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                                        <div>
                                            <div className="font-semibold">{r.room}</div>
                                            <div className="text-sm text-muted-foreground">{r.formattedLocation}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-8">{noResults}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
