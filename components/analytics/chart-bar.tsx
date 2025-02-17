"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

const monthlyStats = [
  { month: "2024-05", totalMessages: 468, uniqueUsers: 9, averageMessages: 52 },
  {
    month: "2024-06",
    totalMessages: 1152,
    uniqueUsers: 14,
    averageMessages: 82.29
  },
  {
    month: "2024-07",
    totalMessages: 1694,
    uniqueUsers: 25,
    averageMessages: 67.76
  },
  {
    month: "2024-08",
    totalMessages: 1820,
    uniqueUsers: 32,
    averageMessages: 56.88
  },
  {
    month: "2024-09",
    totalMessages: 4218,
    uniqueUsers: 55,
    averageMessages: 76.69
  },
  {
    month: "2024-10",
    totalMessages: 6694,
    uniqueUsers: 72,
    averageMessages: 92.97
  },
  {
    month: "2024-11",
    totalMessages: 9144,
    uniqueUsers: 87,
    averageMessages: 105.1
  },
  {
    month: "2024-12",
    totalMessages: 9820,
    uniqueUsers: 105,
    averageMessages: 93.52
  },
  {
    month: "2025-01",
    totalMessages: 15442,
    uniqueUsers: 185,
    averageMessages: 83.47
  }
]

const chartConfig = {
  totalMessages: {
    label: "Total Messages",
    color: "hsl(var(--chart-1))"
  },
  uniqueUsers: {
    label: "Unique Users",
    color: "hsl(var(--chart-2))"
  },
  averageMessages: {
    label: "Avg Messages/User",
    color: "hsl(var(--chart-3))"
  }
}

export function ChartBar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Statistics</CardTitle>
        <CardDescription>
          Total messages, unique users, and average messages per user
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart
            data={monthlyStats}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="hsl(var(--chart-1))"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--chart-2))"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              yAxisId="left"
              dataKey="totalMessages"
              fill="hsl(var(--chart-1))"
            />
            <Bar
              yAxisId="right"
              dataKey="uniqueUsers"
              fill="hsl(var(--chart-2))"
            />
            <Bar
              yAxisId="left"
              dataKey="averageMessages"
              fill="hsl(var(--chart-3))"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
