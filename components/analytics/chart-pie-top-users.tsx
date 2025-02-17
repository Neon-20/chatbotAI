"use client"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts"
// Add the Dialog imports
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)
const chartConfig = {
  visitors: {
    label: "Users"
  },
  user1: {
    label: "User 1",
    color: "hsl(var(--chart-1))"
  },
  user2: {
    label: "User 2",
    color: "hsl(var(--chart-2))"
  },
  user3: {
    label: "User 3",
    color: "hsl(var(--chart-3))"
  },
  user4: {
    label: "User 4",
    color: "hsl(var(--chart-4))"
  },
  others: {
    label: "Other",
    color: "hsl(var(--chart-5))"
  }
} satisfies ChartConfig

const COLORS = [
  "var(--ad-teal)",
  "var(--ad-gold)",
  "var(--ad-orange)",
  "var(--ad-gray-400)",
  "var(--ad-gray-600)",
  "var(--ad-gray-300)"
]

export function ChartPieTopUsers() {
  const [chartData, setChartData] = useState<
    Array<{ name: string; value: number }>
  >([])
  // Add dialog open state
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("messages").select("user_id")
      if (error) {
        console.error("Error fetching messages:", error.message)
        return
      }
      const userCounts: Record<string, number> = {}
      data?.forEach(row => {
        const user = row.user_id || "Unknown"
        userCounts[user] = (userCounts[user] || 0) + 1
      })
      // Build sorted array
      const usersArray = Object.entries(userCounts)
        .map(([user, count], index) => ({
          name: `User ${index + 1}`,
          value: count
        }))
        .sort((a, b) => b.value - a.value)
      // Top 5 and rest as "Others"
      const topUsers = usersArray.slice(0, 5)
      const othersTotal = usersArray
        .slice(5)
        .reduce((sum, entry) => sum + entry.value, 0)
      if (othersTotal > 0) {
        topUsers.push({ name: "Others", value: othersTotal })
      }
      setChartData(topUsers)
    }
    fetchData()
  }, [])

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-ad-teal">Top Users Distribution</CardTitle>
          <CardDescription>
            Message distribution among top 5 users and others
          </CardDescription>
        </CardHeader>
        <CardContent
          className="h-[300px] w-full grow"
          onClick={() => setIsOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            style={{ cursor: "pointer" }}
          >
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <Tooltip />
                <Legend />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[80vh] w-[1200px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Top Users Distribution</DialogTitle>
          </DialogHeader>
          {/* Enlarge the pie chart for detailed view */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={200}
                innerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={entry => entry.name}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </DialogContent>
      </Dialog>
    </>
  )
}
