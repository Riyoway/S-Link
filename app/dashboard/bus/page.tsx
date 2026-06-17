import { requireAuth } from "@/lib/auth-guard"
import { PageHeader } from "@/components/page-header"
import { getDictionary } from "@/lib/dictionaries"
import { BusDashboard } from "@/components/bus/bus-dashboard"
import { getBusRoutes } from "@/lib/bus-data"
import { getProfile } from "@/app/actions/profile"

export default async function BusPage() {
  const { session } = await requireAuth("/dashboard/bus")
  const profile = await getProfile()
  
  // @ts-ignore
  const lang = session?.user?.language || "ja_JP"
  // Use profile data if available (fresh), otherwise fallback to session
  // @ts-ignore
  const commuteMethod = profile?.commute_method ?? session?.user?.commute_method ?? 0
  
  const dict = await getDictionary(lang, "bus")
  const routes = await getBusRoutes()

  return (
    <>
      <PageHeader title={dict.title || "バス予定表"} dictKey="bus" entryKey="title" />
      <div className="flex-1 overflow-y-auto">
        <BusDashboard 
            initialRoutes={routes} 
            userCommuteMethod={commuteMethod} 
            dict={dict} 
            lang={lang}
        />
      </div>
    </>
  )
}
