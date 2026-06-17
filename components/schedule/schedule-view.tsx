"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays, getDay, isSameDay } from "date-fns";
import { 
  ja, enUS, enGB, enAU, enCA, enIN, enNZ,
  zhCN, zhTW, zhHK, ko,
  es, fr, de, it, ptBR, ru,
  arEG, arSA 
} from "date-fns/locale";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { SyllabusLink } from "./syllabus-link";
import { SyllabusPaths } from "@/app/actions/schedule";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, User, BookOpen, Users, Clock, Coffee } from "lucide-react";
import {
    DailySchedule,
    SubjectPlan,
    EventDay,
    ClassInfo
} from "@/app/actions/schedule";

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
};

type ScheduleViewProps = {
    schedule: DailySchedule[];
    plans: SubjectPlan[];
    events: EventDay[];
    syllabusPaths?: SyllabusPaths;
    userProfile: any;
    resolvedCourse?: string;
    currentWeek?: number;
    initialDate: Date;
    year?: string;
    dict: any;
    lang?: string;
};

export function ScheduleView({
    schedule,
    plans,
    events,
    syllabusPaths,
    userProfile,
    resolvedCourse,
    currentWeek,
    initialDate,
    year = new Date().getFullYear().toString(),
    dict,
    lang = "ja_JP"
}: ScheduleViewProps) {
    const [currentDate, setCurrentDate] = useState<Date>(initialDate);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        // Update 'now' every minute for highlighting
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // --- Helpers ---
    const handlePrevDay = () => setCurrentDate(prev => subDays(prev, 1));
    const handleNextDay = () => setCurrentDate(prev => addDays(prev, 1));

    const localeObj = locales[lang] || ja;
    // Fallback format: Use Japanese format only for ja_JP, otherwise use standard format
    const defaultFormat = lang === "ja_JP" ? "M月d日 (E)" : "MMM d (E)";
    const dateFormat = dict.date_format || defaultFormat;
    const dateStr = format(currentDate, dateFormat, { locale: localeObj });
    const dayOfMonth = currentDate.getDate();

    // Event & Holiday Logic
    const currentEvent = events.find(e => parseInt(e.day) === dayOfMonth);
    const isHoliday = currentEvent?.hex === "#eb4034" || currentEvent?.event?.includes("休日") || currentEvent?.event?.includes("休講") || currentEvent?.event?.includes("冬期休業") || currentEvent?.event?.includes("春期休業");
    const moveSchedule = currentEvent?.move_schedule;

    let targetDayOfWeek = getDay(currentDate);
    if (moveSchedule) targetDayOfWeek = moveSchedule;

    const isWeekend = targetDayOfWeek === 0 || targetDayOfWeek === 6;
    const showSchedule = !isHoliday && (!isWeekend || moveSchedule);

    const dailySchedule = schedule.find(s => s.day_of_week === targetDayOfWeek);

    // Filter Classes
    // G1/G2: Use class number (profile.class: "1"-"5")
    // G3+: Use course code (resolvedCourse: "m", "e", "i", etc.)
    const filterClasses = (classes: ClassInfo[]) => {
        if (!userProfile) return classes;

        // Determine user's grade level (1, 2, 3, etc.)
        const gradeNum = parseInt(userProfile.grade?.replace("g", "") || "1", 10);
        const isLowerGrade = gradeNum <= 2; // G1/G2 use class numbers, G3+ use course codes

        // User's class number (for G1/G2)
        const userClassNum = userProfile.class; // e.g., "1", "2", "3"

        // User's course code (for G3+)
        const userCourse = resolvedCourse?.toUpperCase() ||
            userProfile.course?.replace("科", "").substring(0, 1).toUpperCase();

        return classes.filter(cls => {
            // Always include Lunch
            if (cls.subject === "昼休憩") return true;

            const cg = cls.class_group;

            // Handle string class_group
            if (typeof cg === 'string') {
                if (cg === "全") return true;
                if (cg === "S") return true; // Special class, always show

                if (isLowerGrade) {
                    // G1/G2: Match by class number
                    if (!userClassNum) return true; // No class set, show all
                    return cg === userClassNum;
                } else {
                    // G3+: Match by course code
                    if (!userCourse) return true; // No course set, show all
                    return cg.toUpperCase().startsWith(userCourse);
                }
            }

            // Handle array class_group (e.g., ["全", "S"], ["全", "A1"])
            if (Array.isArray(cg)) {
                if (cg.includes("全")) return true;
                if (cg.includes("S")) return true;

                if (isLowerGrade) {
                    // G1/G2: Check if any element matches class number
                    if (!userClassNum) return true;
                    return cg.includes(userClassNum);
                } else {
                    // G3+: Check if any element starts with course code
                    if (!userCourse) return true;
                    return cg.some(c => c.toUpperCase().startsWith(userCourse));
                }
            }

            return true; // Fallback: show if structure is unexpected
        });
    };

    const activePeriods = (showSchedule && dailySchedule) ? dailySchedule.periods.map(period => ({
        ...period,
        classes: filterClasses(period.classes)
    })).filter(p => p.classes.length > 0) : [];

    // --- Time Logic ---
    const currentTimeVal = now.getHours() * 60 + now.getMinutes();

    return (
        <div className="space-y-4 max-w-4xl mx-auto p-2">
            {/* Header */}
            <div className="flex items-center justify-between bg-card rounded-lg p-3 shadow-sm border">
                <Button variant="ghost" size="icon" onClick={handlePrevDay}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="text-center">
                    <h2 className="text-lg font-bold flex items-center justify-center gap-2">
                        <CalendarIcon className="h-4 w-4 opacity-70" />
                        {dateStr}
                    </h2>
                    {currentEvent?.event && (
                        <Badge variant={isHoliday ? "destructive" : "secondary"} className="mt-1 text-xs">
                            {currentEvent.event}
                            {currentEvent.supplement && ` (${currentEvent.supplement})`}
                        </Badge>
                    )}
                </div>
                <Button variant="ghost" size="icon" onClick={handleNextDay}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
                {(!activePeriods.length) ? (
                    <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg mt-4">
                        <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p>{dict.no_classes}</p>
                    </div>
                ) : (
                    activePeriods.map((period, idx) => {
                        const [startStr, endStr] = period.time.range.split('-');
                        const [startH, startM] = startStr.split(':').map(Number);
                        const [endH, endM] = endStr.split(':').map(Number);

                        const startVal = startH * 60 + startM;
                        const endVal = endH * 60 + endM;

                        // "Now" highlighting logic
                        const timeIsWithin = currentTimeVal >= startVal && currentTimeVal < endVal;
                        const isToday = isSameDay(currentDate, now);
                        const isCurrent = isToday && timeIsWithin;

                        // Check for break after this period
                        let breakElem = null;
                        if (idx < activePeriods.length - 1) {
                            const nextPeriod = activePeriods[idx + 1];
                            const [nextStartStr] = nextPeriod.time.range.split('-');
                            const [nextStartH, nextStartM] = nextStartStr.split(':').map(Number);
                            const nextStartVal = nextStartH * 60 + nextStartM;

                            // If gap exists and not lunch (Lunch is handled as a class usually, but if "昼休憩" is a class, we keep it)
                            // Actually lunch might be a "Class" in my json.
                            if (nextStartVal > endVal) {
                                // It's a break
                                const breakIsCurrent = isToday && currentTimeVal >= endVal && currentTimeVal < nextStartVal;
                                breakElem = (
                                    <div key={`break-${idx}`} className={`flex gap-3 items-center py-1 px-4 my-1 rounded-sm transition-colors ${breakIsCurrent ? "bg-yellow-500/10 ring-1 ring-yellow-500/20" : "bg-transparent"}`}>
                                        <div className="w-16 shrink-0 text-right pr-2 text-[10px] text-muted-foreground/50">
                                            {(nextStartVal - endVal)}m
                                        </div>
                                        <div className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 ${breakIsCurrent ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground/30"}`}>
                                            <Coffee className="h-3 w-3" />
                                            {dict.break_label}
                                        </div>
                                    </div>
                                );
                            }
                        }

                        return (
                            <div key={idx} className="contents">
                                <div className={`flex gap-3 items-stretch py-3 border-b last:border-0 transition-all duration-300 ${isCurrent ? "bg-primary/5 -mx-2 px-2 rounded-lg border-transparent shadow-sm" : ""}`}>
                                    {/* Time Column */}
                                    <div className={`w-16 shrink-0 flex flex-col justify-between text-right pr-3 border-r-2 ${isCurrent ? "border-primary" : "border-border/50"} py-1 relative`}>
                                        {isCurrent && (
                                            <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
                                        )}
                                        <div>
                                            <span className={`text-sm font-bold block leading-none ${isCurrent ? "text-primary scale-110 origin-right transition-transform" : "text-muted-foreground"}`}>{startStr}</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground/40 font-mono my-1 flex justify-end">
                                            <span className="bg-muted/50 px-1 rounded">{period.time.label}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-muted-foreground block leading-none opacity-50">{endStr}</span>
                                        </div>
                                    </div>

                                    {/* Classes Column */}
                                    <div className="grow grid gap-2">
                                        {period.classes.map((cls, cIdx) => {
                                            const isLunch = cls.subject === "昼休憩";
                                            const plan = plans.find(p => p.subject === cls.subject);

                                            if (isLunch) {
                                                return (
                                                    <div key={cIdx} className="bg-muted/30 rounded-lg px-3 py-2 text-sm text-center text-muted-foreground flex items-center justify-center gap-2 border border-dashed border-border/50">
                                                        <Coffee className="h-4 w-4 opacity-50" />
                                                        <span className="text-xs font-medium">{cls.subject}</span>
                                                    </div>
                                                )
                                            }

                                            return (
                                                <div key={cIdx} className={`group relative bg-card rounded-xl border p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shadow-sm hover:shadow-md transition-all ${isCurrent ? "border-primary/50 shadow-md ring-1 ring-primary/10 bg-primary/5" : "hover:border-primary/20"}`}>
                                                    <div className="grid gap-1.5">
                                                        <div className="font-bold text-lg leading-tight flex items-center gap-2">
                                                            {cls.subject}
                                                            {isCurrent && (
                                                                <Badge className="text-[10px] h-5 px-1.5 animate-pulse gap-1" variant="default">
                                                                    <Clock className="h-3 w-3" />
                                                                    {dict.now}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 font-normal gap-1.5 text-muted-foreground bg-background/50">
                                                                <MapPin className="h-3 w-3" />
                                                                {Array.isArray(cls.room) ? cls.room.join(", ") : cls.room}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 font-normal gap-1.5 text-muted-foreground bg-background/50">
                                                                <User className="h-3 w-3" />
                                                                {Array.isArray(cls.teacher) ? cls.teacher.join(", ") : cls.teacher}
                                                            </Badge>
                                                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-5 font-normal gap-1.5 bg-muted/80 hover:bg-muted">
                                                                <Users className="h-3 w-3" />
                                                                {Array.isArray(cls.class_group) ? cls.class_group.join("/") : cls.class_group}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="self-end sm:self-center">
                                                        <SyllabusLink
                                                            subject={cls.subject}
                                                            plan={plan}
                                                            syllabusPaths={syllabusPaths}
                                                            grade={userProfile?.grade || "g1"}
                                                            course={userProfile?.course}
                                                            year={year}
                                                            week={currentWeek}
                                                            labels={{
                                                                syllabus: dict.syllabus,
                                                                pdf: dict.pdf,
                                                                week_prefix: dict.week_prefix,
                                                                week_suffix: dict.week_suffix,
                                                                preparation: dict.preparation,
                                                                review: dict.review
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {breakElem}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
