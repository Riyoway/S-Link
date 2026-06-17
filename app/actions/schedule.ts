"use server";

import fs from "fs/promises";
import path from "path";

// --- Types ---

export type PeriodTime = {
    label: string;
    range: string;
};

export type ClassInfo = {
    class_group: string | string[];
    subject: string;
    room: string | string[];
    teacher: string | string[];
};

export type Period = {
    time: PeriodTime;
    classes: ClassInfo[];
};

export type DailySchedule = {
    day_of_week: number;
    periods: Period[];
};

export type PlanWeek = {
    week: number;
    topic: string;
    preparation: string;
    review: string;
};

export type SubjectPlan = {
    subject: string;
    schedule: PlanWeek[];
};

export type EventDay = {
    day: string;
    weekday: string;
    event: string | null;
    supplement?: string;
    hex?: string;
    move_schedule?: number;
};

export type SyllabusPaths = {
    [year: string]: {
        common: string;
        depts: { [key: string]: string };
    };
};

// --- Helpers ---

const DATA_DIR = path.join(process.cwd(), "public/data");

async function readJson<T>(filePath: string): Promise<T | null> {
    try {
        const fullPath = path.join(DATA_DIR, filePath);
        const data = await fs.readFile(fullPath, "utf-8");
        return JSON.parse(data) as T;
    } catch (error: any) {
        if (error?.code !== "ENOENT") {
            console.error(`Error reading data from ${filePath}:`, error);
        }
        return null;
    }
}

// --- Actions ---

/**
 * Fetches the weekly schedule for a specific grade in a semester.
 * @param semester "sem1" | "sem2"
 * @param grade "g1" | "g2" | "g3" | "g4" | "g5"
 */
export async function fetchSchedule(
    semester: string,
    grade: string
): Promise<DailySchedule[]> {
    const filePath = `schedule/${semester}/${grade}.json`;
    const schedule = await readJson<DailySchedule[]>(filePath);
    return schedule || [];
}

/**
 * Fetches the lesson plans for a specific grade/course in a semester.
 * For G3, it merges the common plan (g3.json) with the course-specific plan (g3_*.json).
 * @param semester "sem1" | "sem2"
 * @param grade "g1" | "g2" | "g3" | "g4" | "g5"
 * @param course "m" | "e" | "i" | "c" | "a" (Optional, required for G3+)
 */
export async function fetchPlans(
    semester: string,
    grade: string,
    course?: string
): Promise<SubjectPlan[]> {
    const plans: SubjectPlan[] = [];

    // 1. Fetch common/main plan
    // For G1/G2, it's just g1/g1.json. For G3, it's g3/g3.json (common subjects).
    const commonPath = `plans/${semester}/${grade}/${grade}.json`;
    const commonPlans = await readJson<SubjectPlan[]>(commonPath);
    if (commonPlans) {
        plans.push(...commonPlans);
    }

    // 2. Fetch course-specific plan if applicable
    if (course && ["g3", "g4", "g5"].includes(grade)) {
        const coursePath = `plans/${semester}/${grade}/${grade}_${course}.json`;
        const coursePlans = await readJson<SubjectPlan[]>(coursePath);
        if (coursePlans) {
            plans.push(...coursePlans);
        }
    }

    // Deduplicate? (Assuming no name collisions between common and course for now, 
    // but if so, existing logic implies they are distinct sets of subjects)

    return plans;
}

/**
 * Fetches events for a specific month in a semester.
 * @param semester "sem1" | "sem2"
 * @param month number (1-12)
 */
export async function fetchEvents(
    semester: string,
    month: number
): Promise<EventDay[]> {
    const filePath = `events/${semester}/${month}.json`;
    const events = await readJson<EventDay[]>(filePath);
    return events || [];
}

/**
 * Fetches the syllabus PDF paths configuration.
 */
export async function fetchSyllabusPaths(): Promise<SyllabusPaths | null> {
    const filePath = "syllabus_paths.json";
    return await readJson<SyllabusPaths>(filePath);
}

/**
 * Fetches ALL events for a semester (to calculate weeks).
 */
export async function fetchAllSemesterEvents(semester: string): Promise<{ month: number; days: EventDay[] }[]> {
    const months = semester === "sem2" ? [10, 11, 12, 1, 2, 3] : [4, 5, 6, 7, 8, 9];
    const results = await Promise.all(
        months.map(async (m) => ({
            month: m,
            days: await fetchEvents(semester, m)
        }))
    );
    return results;
}

/**
 * Calculate the current syllabus week (1-15) based on events.
 * Iterates through weeks from semester start, counting only weeks with classes.
 */
export async function calculateSyllabusWeek(semester: string, currentDate: Date): Promise<number> {
    const allMonthEvents = await fetchAllSemesterEvents(semester);

    // 1. Determine Start Date (Apr 1 or Oct 1)
    const currentYear = currentDate.getMonth() < 3 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    const startMonth = semester === "sem2" ? 9 : 3; // 0-indexed: Oct=9, Apr=3
    const startDate = new Date(currentYear, startMonth, 1);

    // 2. Iterate week by week until currentDate
    let weekCount = 0;
    let iterDate = new Date(startDate);

    // Helper to check if a date is a school day
    const isSchoolDay = (d: Date) => {
        const m = d.getMonth() + 1;
        const day = d.getDate();
        const monthData = allMonthEvents.find(e => e.month === m);
        const dayData = monthData?.days.find(e => parseInt(e.day) === day);

        // If no data, assume valid weekday (unless weekend)
        if (!dayData) {
            const tempDay = d.getDay();
            return tempDay !== 0 && tempDay !== 6;
        }

        const isHoliday = dayData.hex === "#eb4034" ||
            dayData.event?.includes("休講") ||
            dayData.event?.includes("休業") ||
            dayData.event?.includes("冬期") ||
            dayData.event?.includes("春期");

        const moveSchedule = dayData.move_schedule;

        // Valid if: NOT Holiday AND (Not Weekend OR Has Move Schedule)
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        return !isHoliday && (!isWeekend || !!moveSchedule);
    };

    while (iterDate <= currentDate) {
        // Check if ANY day in this week (Mon-Sun) is a school day
        // Align loop to weeks? Simple iter: check 7 days, if any valid, increment.
        // But "Week 1" starts Oct 1 (Tue). So first "Chunk" is Oct 1 - Oct 6.
        // Just increment valid weeks.

        let hasClass = false;
        // Check next 7 days (or until currentDate?)
        // Actually syllabus weeks are usually fixed blocks.
        // Let's iterate day by day? No, explicit weeks.

        // Better: Iterate MONDAYS.
        // Find first Monday on or before StartDate? 
        // Or just iterate 7-day blocks from StartDate?
        // Let's use 7-day blocks starting from StartDate.

        const weekEnd = new Date(iterDate);
        weekEnd.setDate(iterDate.getDate() + 6);

        // Scan this week block
        let checkDate = new Date(iterDate);
        while (checkDate <= weekEnd) {
            if (isSchoolDay(checkDate)) {
                hasClass = true;
                break;
            }
            checkDate.setDate(checkDate.getDate() + 1);
        }

        if (hasClass) {
            weekCount++;
        }

        if (currentDate >= iterDate && currentDate <= weekEnd) {
            break; // Found current week
        }

        iterDate.setDate(iterDate.getDate() + 7);
        if (weekCount >= 20) break; // Safety break
    }

    return Math.max(1, Math.min(weekCount, 15));
}
