"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

const chartData = [
  { name: "User 1", messages: 440 },
  { name: "User 2", messages: 304 },
  { name: "User 3", messages: 134 }
]

const chartConfig = {
  messages: {
    label: "Messages",
    color: "hsl(var(--chart-1))"
  }
}

export function ChartArea() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 3 Users by Messages</CardTitle>
        <CardDescription>Total messages sent</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="messages"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
