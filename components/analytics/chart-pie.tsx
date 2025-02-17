"use client"

import { Cell, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

const topUsers = [
  { user_id: "d059e8c0-ff00-47db-ae89-271ffc3489ea", totalMessages: 4110 },
  { user_id: "1d647ac1-d1ff-4c75-97e6-9ce780908110", totalMessages: 2492 },
  { user_id: "7440400d-7b07-4982-89fd-cd8a4f2f7872", totalMessages: 2394 },
  { user_id: "bd5f374b-6115-4025-a778-243b5739c9fa", totalMessages: 2520 },
  { user_id: "76d2bd50-1822-46e6-a0ec-5e45c70019bc", totalMessages: 2192 }
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
]

const chartConfig = {
  totalMessages: {
    label: "Total Messages",
    color: "hsl(var(--chart-1))"
  }
}

export function ChartPie() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Users by Total Messages</CardTitle>
        <CardDescription>
          Distribution of messages among top users
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <PieChart>
            <Pie
              data={topUsers}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              dataKey="totalMessages"
              nameKey="user_id"
              label={({ name, percent }) =>
                `${name.slice(0, 8)}... ${(percent * 100).toFixed(0)}%`
              }
            >
              {topUsers.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
