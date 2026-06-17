import { requireAuth } from "@/lib/auth-guard";
import { getDictionary } from "@/lib/dictionaries";
import { PageHeader } from "@/components/page-header";
import { EventsApp } from "@/components/events/events-app";
import fs from "fs/promises";
import path from "path";

async function getEventsData() {
  const data: { sem1: { [key: string]: any[] }; sem2: { [key: string]: any[] } } = { 
    sem1: {}, 
    sem2: {} 
  };
  
  const baseDir = path.join(process.cwd(), "public", "data", "events");

  for (const sem of ["sem1", "sem2"] as const) {
    const semDir = path.join(baseDir, sem);
    try {
      const files = await fs.readdir(semDir);
      for (const file of files) {
        if (file.endsWith(".json")) {
          const month = path.basename(file, ".json");
          const content = await fs.readFile(path.join(semDir, file), "utf-8");
          try {
            data[sem][month] = JSON.parse(content);
          } catch (e) {
            console.error(`Failed to parse ${sem}/${file}`, e);
          }
        }
      }
    } catch (e) {
      console.log(`Directory ${sem} not found or empty`, e);
    }
  }
  return data;
}

export default async function Dashboard() {
  const { session } = await requireAuth("/dashboard/events");

  const lang = (session?.user as { language?: string } | undefined)?.language ?? "ja_JP";
  const dict = await getDictionary(lang, "events");
  const eventsData = await getEventsData();

  return (
    <>
      <PageHeader title={dict.title} dictKey="events" entryKey="title" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <EventsApp eventsData={eventsData} initialDict={dict} />
      </div>
    </>
  );
}

