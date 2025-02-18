"use client"
import { ChartConfig } from "@/components/ui/chart"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
          <h3 className="mb-2 text-lg font-medium">Top Users Distribution</h3>
          <p className="mb-6 text-sm text-gray-500">
            Message distribution among top 5 users and others
          </p>
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
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
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
