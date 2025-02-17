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
import { Cell, Pie, PieChart } from "recharts"

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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-ad-teal">Top Users Distribution</CardTitle>
        <CardDescription>
          Message distribution among top 5 users and others
        </CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
