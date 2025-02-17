import { ChartMessagesGrowth } from "@/components/analytics/chart-messages-growth"
import { ChartPieTopUsers } from "@/components/analytics/chart-pie-top-users"
import { ChartAreaCumulative } from "@/components/analytics/chart-area-cumulative"
import { ChartFileTypes } from "@/components/analytics/chart-file-types"
import { ChartActiveUsers } from "@/components/analytics/chart-active-users"
import { KeyMetrics } from "@/components/analytics/key-metrics"
import { TopUsersTable } from "@/components/analytics/top-users-table"
import { BarChart3 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Logo from "@/components/icons/logo"
import Link from "next/link"
import NewChat from "@/components/analytics/newChat"

export default async function Page() {
  const supabaseAdmin = createClient(
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
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo height={80} width={80} />
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
