import { requireAuth } from "@/lib/auth-guard";
import { getDictionary } from "@/lib/dictionaries";
import { PageHeader } from "@/components/page-header";
import { getProfile } from "@/app/actions/profile";
import { getDashboardStats, getChangelog } from "@/app/actions/dashboard";
import { getBusRoutes } from "@/lib/bus-data";
import { fetchEvents, EventDay } from "@/app/actions/schedule"; // Import fetchEvents
import { WeatherWidget } from "@/components/dashboard/weather-widget";
import { StorageWidget } from "@/components/dashboard/storage-widget";
import { NextBusWidget } from "@/components/dashboard/next-bus-widget";
import { UpdateHistoryWidget } from "@/components/dashboard/update-history-widget";
import { UpcomingEventsWidget } from "@/components/dashboard/upcoming-events-widget"; // Import new widget
import { NewsTicker } from "@/components/dashboard/news-ticker"; // Import NewsTicker
import { DashboardAnimator, AnimatedItem } from "@/components/dashboard/dashboard-animator";
import { format } from "date-fns";
import { ja, enUS } from "date-fns/locale";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const { session } = await requireAuth("/dashboard");

  // @ts-ignore
  const lang = session.user?.language || "ja_JP";
  const dict = await getDictionary(lang, 'dashboard');

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  
  // Helper to determine semester
  const getSemester = (m: number) => (m >= 4 && m <= 9) ? "sem1" : "sem2";
  
  const currentSemester = getSemester(currentMonth);
  const nextSemester = getSemester(nextMonth);

  // Fetch all necessary data in parallel
  const [profile, stats, busRoutes, changelog, currentMonthEvents, nextMonthEvents] = await Promise.all([
    getProfile(),
    getDashboardStats(),
    getBusRoutes(),
    getChangelog(),
    fetchEvents(currentSemester, currentMonth),
    fetchEvents(nextSemester, nextMonth)
  ]);

  // Process Events: Filter for today onwards and flatten
  const todayDate = now.getDate();
  const currentYear = now.getFullYear();
  // Handle year rollover for next month (e.g. Dec -> Jan)
  const nextMonthYear = (currentMonth === 12 && nextMonth === 1) ? currentYear + 1 : currentYear;

  const upcomingEvents = [
    ...currentMonthEvents
      .filter(e => parseInt(e.day) >= todayDate && e.event) // From today, has event
      .map(e => ({ date: new Date(currentYear, currentMonth - 1, parseInt(e.day)), event: e })),
    ...nextMonthEvents
      .filter(e => e.event) // All next month events
      .map(e => ({ date: new Date(nextMonthYear, nextMonth - 1, parseInt(e.day)), event: e }))
  ].slice(0, 5); // Take top 5

  const localeObj = lang === "en_US" ? enUS : ja;
  const today = format(now, dict.date_format, { locale: localeObj });

  return (
    <div className="pb-20">
      <PageHeader title={dict.title} dictKey="dashboard" entryKey="title" />
      <NewsTicker updates={changelog} dict={dict.widgets.news_ticker} />
      
      <div className="px-4 max-w-7xl mx-auto mt-6">
        <div className="mb-8 pl-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              {(() => {
                const parts = dict.welcome.split("{name}");
                return (
                  <>
                    {parts[0]}
                    <br className="block md:hidden" />
                    {session.user?.name || ""}
                    {parts[1]}
                  </>
                );
              })()}
            </h2>
          </div>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
            {today}
          </p>
        </div>

        <DashboardAnimator>
          {/* Main Info Area (Left Column on LG) */}
          <div className="col-span-2 lg:col-span-8 grid gap-6 grid-cols-1 md:grid-cols-2 auto-rows-min">
            
            {/* Next Bus - Wide (Priority) */}
            <AnimatedItem className="col-span-1 md:col-span-2">
              <NextBusWidget 
                routes={busRoutes} 
                userCommuteMethod={profile?.commute_method}
                dict={dict.widgets.bus}
              />
            </AnimatedItem>

            {/* Weather & Storage Row */}
            <AnimatedItem className="col-span-1 md:col-span-1">
               <WeatherWidget dict={dict.widgets.weather} />
            </AnimatedItem>
            <AnimatedItem className="col-span-1 md:col-span-1">
              <StorageWidget stats={stats} dict={dict.widgets.storage} />
            </AnimatedItem>
          </div>

          {/* Sidebar Area (Right Column on LG) */}
          <div className="col-span-2 lg:col-span-4 flex flex-col gap-6">
            
            {/* Upcoming Events */}
            <AnimatedItem className="min-h-[200px]">
              <UpcomingEventsWidget events={upcomingEvents} dict={dict.widgets.events} lang={lang} />
            </AnimatedItem>

            {/* Update History */}
            <AnimatedItem className="h-full min-h-[300px]">
              <UpdateHistoryWidget updates={changelog} dict={dict.widgets.updates} />
            </AnimatedItem>
          </div>
        </DashboardAnimator>
      </div>
    </div>
  );
}
