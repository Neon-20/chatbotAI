"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

const data = [
  { month: "2024-05", avg_messages: 52, median_messages: 30 },
  { month: "2024-06", avg_messages: 82, median_messages: 50 },
  { month: "2024-07", avg_messages: 68, median_messages: 32 },
  { month: "2024-08", avg_messages: 57, median_messages: 14 }
]

export function ChartBarMessages() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-ad-teal">User Engagement</CardTitle>
        <CardDescription>
          Average and median messages per user each month
        </CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--ad-gray-200)" />
            <XAxis dataKey="month" stroke="var(--ad-gray-600)" />
            <YAxis stroke="var(--ad-gray-600)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--ad-white)",
                borderColor: "var(--ad-gray-300)"
              }}
            />
            <Legend />
            <Bar
              dataKey="avg_messages"
              fill="var(--ad-teal)"
              name="Average Messages"
            />
            <Bar
              dataKey="median_messages"
              fill="var(--ad-gold)"
              name="Median Messages"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
