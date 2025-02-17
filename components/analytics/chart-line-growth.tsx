"use client"

import {
  Line,
  LineChart,
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
  { month: "2024-05", total_messages: 468, unique_users: 9 },
  { month: "2024-06", total_messages: 1152, unique_users: 14 },
  { month: "2024-07", total_messages: 1694, unique_users: 25 },
  { month: "2024-08", total_messages: 1820, unique_users: 32 }
]

export function ChartLineGrowth() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-ad-teal">Platform Growth</CardTitle>
        <CardDescription>
          Total messages and unique users over time
        </CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--ad-gray-200)" />
            <XAxis dataKey="month" stroke="var(--ad-gray-600)" />
            <YAxis yAxisId="left" stroke="var(--ad-gray-600)" />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--ad-gray-600)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--ad-white)",
                borderColor: "var(--ad-gray-300)"
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total_messages"
              name="Total Messages"
              stroke="var(--ad-teal)"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="unique_users"
              name="Unique Users"
              stroke="var(--ad-gold)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
