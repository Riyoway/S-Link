import { requireAuth } from "@/lib/auth-guard";
import { getDictionary } from "@/lib/dictionaries";
import { PageHeader } from "@/components/page-header";
import { getProfile } from "@/app/actions/profile";
import { fetchSchedule, fetchPlans, fetchEvents, fetchSyllabusPaths, calculateSyllabusWeek } from "@/app/actions/schedule";
import { ScheduleView } from "@/components/schedule/schedule-view";

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
  const { session } = await requireAuth("/dashboard/schedule");
  const profile = await getProfile();

  const lang = (session?.user as { language?: string } | undefined)?.language ?? "ja_JP";
  const dict = await getDictionary(lang, "schedule");

  // Defaults (TODO: Calculate semester dynamically based on date)

  const semester = "sem2";
  const rawGrade = profile?.grade || "g1";
  const grade = rawGrade.startsWith("g") ? rawGrade : `g${rawGrade}`;

  // Course Mapping
  let course: string | undefined;
  if (profile?.course) {
    const c = profile.course;
    if (c.includes("機械")) course = "m";
    else if (c.includes("電気")) course = "e";
    else if (c.includes("制御") || c.includes("情報")) course = "i";
    else if (c.includes("建設") || c.includes("環境") || c.includes("建築")) course = "ca";
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  // Academic year starts in April. If Jan-Mar, subtract 1 from year.
  const academicYear = currentMonth < 4 ? now.getFullYear() - 1 : now.getFullYear();
  const currentYear = academicYear.toString();

  const [scheduleData, planData, eventData, syllabusPaths, currentWeek] = await Promise.all([
    fetchSchedule(semester, grade),
    fetchPlans(semester, grade, course),
    fetchEvents(semester, currentMonth),
    fetchSyllabusPaths(),
    calculateSyllabusWeek(semester, now)
  ]);

  return (
    <>
      <PageHeader title={dict.title} dictKey="schedule" entryKey="title" />
      <ScheduleView
        schedule={scheduleData}
        plans={planData}
        events={eventData}
        syllabusPaths={syllabusPaths || undefined}
        userProfile={profile}
        resolvedCourse={course} // Pass mapped code (e.g. "i", "m")
        initialDate={new Date()}
        year={currentYear}
        currentWeek={currentWeek}
        dict={dict}
        lang={lang}
      />
    </>
  );
}
