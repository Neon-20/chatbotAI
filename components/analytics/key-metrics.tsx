"use client"
import { useState, useEffect, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getAllActiveUsers,
  getCurrentMonthMessages,
  get30daysMessages,
  getLast30DaysMessages
} from "@/db/client_admin"
import { BarChart2, MessageSquare, Users, UserCircle } from "lucide-react"
import { getAllProfiles } from "@/db/profile"

type MetricsTypes = {
  title: string
  value: number | string
  description: string
  className: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
}[]

const KeyMetricsComponent = ({ selectedMonth }: { selectedMonth?: string }) => {
  const [metrics, setMetrics] = useState<MetricsTypes>([])

  useEffect(() => {
    async function fetchData() {
      // --- 1. Total Users ---
      const profiles = await getAllProfiles()
      const totalUsers = profiles.filter(user => user.roles === "user").length

      // --- 2. Total Messages ---
      const totalMessages = await get30daysMessages(selectedMonth)

      // --- 3. Active Users (Last 30 Days) ---
      const activeUsers = await getAllActiveUsers(selectedMonth)

      // --- 4. Average Messages Per Active User ---
      const last30DaysMessages = await getLast30DaysMessages(selectedMonth)
      const avgMessagesPerUser =
        activeUsers > 0 ? (last30DaysMessages / activeUsers).toFixed(2) : 0 // Count messages in the current month
      const currentMonthMessageCount =
        await getCurrentMonthMessages(selectedMonth)

      const data = [
        {
          title: "Total Messages",
          value: totalMessages,
          description: "All-time messages sent",
          className: "bg-[#004851] text-white",
          icon: MessageSquare,
          iconColor: "text-white"
        },
        {
          title: "Total Users",
          value: totalUsers,
          description: "Total users from May",
          className: "bg-[#e84e0f] text-white",
          icon: UserCircle,
          iconColor: "text-white"
        },
        {
          title: "Active Users",
          value: activeUsers,
          description: "Users active in last 30 days",
          className: "bg-[#ffb81c] text-black",
          icon: Users,
          iconColor: "text-black"
        },
        // e84e0f
        {
          title: "Avg. Messages/User",
          value: avgMessagesPerUser,
          description: "Msgs/active user last 30 days",
          className: "bg-[#443627] text-white",
          icon: BarChart2,
          iconColor: "text-white"
        }
      ]
      setMetrics(data)
    }
    fetchData()
  }, [selectedMonth])

  // Render nothing until the fetch completes.
  if (metrics.length === 0) return null
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map(metric => (
        <Card
          key={metric.title}
          className={`${metric.className} shadow-sm transition-all hover:shadow-md`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="mb-4 flex items-center gap-4 text-sm font-medium opacity-90">
              <metric.icon className={"size-5 " + metric.iconColor} />
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {Number(metric.value)
                ? formatNumber(Number(metric.value))
                : metric.value}
            </div>
            <p className="mt-1 text-sm opacity-80">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Wrap with memo so parent rerenders won't trigger unnecessary updates.
export const KeyMetrics = memo(KeyMetricsComponent)

export function formatNumber(num: number): string {
  return num.toLocaleString()
}
