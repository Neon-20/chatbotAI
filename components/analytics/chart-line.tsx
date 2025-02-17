"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
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

const userRetention = [
  { month: "2024-06", retentionRate: 0.2222222222222222 },
  { month: "2024-07", retentionRate: 0.2857142857142857 },
  { month: "2024-08", retentionRate: 0.28 },
  { month: "2024-09", retentionRate: 0.34375 },
  { month: "2024-10", retentionRate: 0.4181818181818182 },
  { month: "2024-11", retentionRate: 0.5138888888888888 },
  { month: "2024-12", retentionRate: 0.5517241379310345 },
  { month: "2025-01", retentionRate: 0.5238095238095238 }
]

const chartConfig = {
  retentionRate: {
    label: "Retention Rate",
    color: "hsl(var(--chart-1))"
  }
}

export function ChartLine() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Retention Rate</CardTitle>
        <CardDescription>Month-over-month user retention</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <LineChart
            data={userRetention}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={value => `${(value * 100).toFixed(0)}%`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="retentionRate"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
