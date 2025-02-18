import { ChartActiveUsers } from "@/components/analytics/chart-active-users"
import { ChartAreaCumulative } from "@/components/analytics/chart-area-cumulative"
import { ChartFileTypes } from "@/components/analytics/chart-file-types"
import { ChartMessagesGrowth } from "@/components/analytics/chart-messages-growth"
import { ChartPieTopUsers } from "@/components/analytics/chart-pie-top-users"
import { KeyMetrics } from "@/components/analytics/key-metrics"
import NewChat from "@/components/analytics/newChat"
import { TopUsersTable } from "@/components/analytics/top-users-table"
import { Database } from "@/supabase/types"
import { createClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"

export default async function Page() {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const oneYearAgoISO = oneYearAgo.toISOString()

  const { data: messages, error } = await supabaseAdmin
    .from("messages")
    .select("created_at, user_id")
    .gte("created_at", oneYearAgoISO)

  if (error) {
    console.error("Error fetching messages:", error.message)
  }

  const monthMap: Record<string, Set<string>> = {}
  messages?.forEach((msg: { created_at: string; user_id: string }) => {
    const date = new Date(msg.created_at)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    if (!monthMap[month]) {
      monthMap[month] = new Set()
    }
    monthMap[month].add(msg.user_id)
  })
  const chartActiveUsersData = Object.entries(monthMap)
    .map(([month, users]) => ({ month, active_users: users.size }))
    .sort((a, b) => (a.month > b.month ? 1 : -1))

  // fileTypeData
  const { data: files, error: filesErr } = await supabaseAdmin
    .from("files")
    .select("type")

  if (filesErr) {
    console.error("Error fetching file types:", filesErr.message)
  }

  const counts: Record<string, number> = {}
  files?.forEach(row => {
    const type = row.type || "Other"
    counts[type] = (counts[type] || 0) + 1
  })

  const fileTypeData = Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="h-14 border-b">
        <div className="container mx-auto h-full px-4">
          <div className="flex  h-16 items-center justify-between ">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="73 101.70 154 96.61"
                preserveAspectRatio="xMidYMid meet"
                className="size-6"
              >
                <g transform="translate(-25,101.70)">
                  <g
                    id="SvgjsG5971"
                    transform="matrix(1.6739130434782612,0,0,1.6739130434782612,91.30434782608695,-35.39084048893142)"
                    fill="currentColor"
                  >
                    <title>Sacred geometry RTE</title>
                    <g data-name="Layer 2">
                      <path d="M60.71436,21.14258A56.71492,56.71492,0,0,0,4,77.85742a1,1,0,0,0,2,0A54.71462,54.71462,0,0,1,60.71436,23.14258,33.28587,33.28587,0,0,1,94,56.42871,20.4284,20.4284,0,0,1,73.57129,76.85742,11.85753,11.85753,0,0,1,61.71436,65a7.57153,7.57153,0,0,1,7.57128-7.57129,3.29022,3.29022,0,0,1,3.28565,3.28516,1,1,0,1,0,2,0,5.2858,5.2858,0,0,0-5.28565-5.28516A9.5718,9.5718,0,0,0,59.71436,65,13.8578,13.8578,0,0,0,73.57129,78.85742,22.42881,22.42881,0,0,0,96,56.42871,35.28624,35.28624,0,0,0,60.71436,21.14258Z"></path>
                    </g>
                  </g>
                </g>
              </svg>
              <span className="font-medium">domusAI Stats Dashboard</span>
            </div>
            <nav className="flex items-center gap-6">
              <NewChat />
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 space-y-6 p-6">
        <KeyMetrics />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartMessagesGrowth />
          </div>
          <ChartActiveUsers chartData={chartActiveUsersData} />
          <ChartFileTypes fileTypeData={fileTypeData} />
          <ChartAreaCumulative />
          <ChartPieTopUsers />
          <div className="lg:col-span-2">
            <TopUsersTable />
          </div>
        </div>
      </main>
    </div>
  )
}
