"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppearance } from "@/components/appearance-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Mail, Clock, User, Search } from "lucide-react";

interface TeacherSearchProps {
    tool: any;
    onBack: () => void;
}

type Teacher = {
    name: string;
    location: {
        building: string | null;
        floor: number | null;
        room: string | null;
    };
    email: string | null;
    office_hours: {
        day: number[] | null;
        time: string | null;
    };
};

type TeachersData = {
    teachers: Teacher[];
};

export function TeacherSearch({ tool, onBack }: TeacherSearchProps) {
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
    const dayNames: string[] = dict.days || ["月", "火", "水", "木", "金"];
    const noResults = dict.no_results || "見つかりませんでした";
    const searchPlaceholder = dict.search_placeholder || "検索...";
    const officeHoursLabel = dict.office_hours || "オフィスアワー";
    const locationLabel = dict.location || "場所";
    const emailLabel = dict.email || "メール";
    const backLabel = dict.back || "戻る";

    const [query, setQuery] = useState("");
    const [teachersData, setTeachersData] = useState<TeachersData | null>(null);

    useEffect(() => {
        fetch("/data/teachers.json")
            .then(res => res.json())
            .then(data => setTeachersData(data))
            .catch(console.error);
    }, []);

    const formatLocation = (loc: Teacher["location"]) => {
        if (!loc.building && !loc.room) return null;

        const parts: string[] = [];
        if (loc.building) {
            parts.push(buildingNames[loc.building] || loc.building);
        }
        if (loc.floor !== null) {
            parts.push(`${loc.floor}${floorSuffix}`);
        }
        if (loc.room) {
            const isNumericRoom = /^\d+$/.test(loc.room);
            parts.push(isNumericRoom ? `${loc.room}${roomSuffix}` : loc.room);
        }
        return parts.join(" ");
    };

    const formatOfficeHours = (oh: Teacher["office_hours"]) => {
        if (!oh.day || oh.day.length === 0) return null;

        const dayStr = oh.day.map(d => dayNames[d - 1] || d).join("・");
        return oh.time ? `${dayStr} ${oh.time}` : dayStr;
    };

    const results = useMemo<Teacher[]>(() => {
        if (!teachersData || !query.trim()) return [];

        const q = query.trim().toLowerCase();
        return teachersData.teachers.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.email?.toLowerCase().includes(q) ||
            t.location.room?.toLowerCase().includes(q)
        );
    }, [teachersData, query]);

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
                    <div className="grid gap-3">
                        {results.length > 0 ? (
                            results.map((teacher, i) => {
                                const loc = formatLocation(teacher.location);
                                const hours = formatOfficeHours(teacher.office_hours);

                                return (
                                    <Card key={i} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 space-y-3">
                                            {/* Name */}
                                            <div className="flex items-center gap-2">
                                                <User className="h-5 w-5 text-primary" />
                                                <span className="font-bold text-lg">{teacher.name}</span>
                                            </div>

                                            {/* Location */}
                                            {loc && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                                    <span>{loc}</span>
                                                </div>
                                            )}

                                            {/* Office Hours */}
                                            {hours && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                                    <span>
                                                        <span className="font-medium">{officeHoursLabel}:</span> {hours}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Email */}
                                            {teacher.email && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                    <a
                                                        href={`mailto:${teacher.email}`}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {teacher.email}
                                                    </a>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <p className="text-center text-muted-foreground py-8">{noResults}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
