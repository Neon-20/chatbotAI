"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line
} from "recharts"

export async function ChartActiveUsers({
  chartData
}: {
  chartData: Array<{ month: string; active_users: number }>
}) {
  return (
    <Card className="h-full shadow-sm transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-ad-teal">Monthly Active Users</CardTitle>
        <CardDescription>Growth in active users over time</CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <ActiveUsersChart data={chartData} />
      </CardContent>
    </Card>
  )
}

// Client component for rendering the chart
export function ActiveUsersChart({
  data
}: {
  data: Array<{ month: string; active_users: number }>
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--ad-gray-200)" />
        <XAxis
          dataKey="month"
          stroke="var(--ad-gray-600)"
          tick={{ fontSize: 12 }}
        />
        <YAxis stroke="var(--ad-gray-600)" tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--ad-white)",
            borderColor: "var(--ad-gray-300)"
          }}
          formatter={(value: number) => [`${value} users`, "Active Users"]}
        />
        <Line
          type="monotone"
          dataKey="active_users"
          stroke="var(--ad-orange)"
          strokeWidth={3}
          dot={{
            fill: "var(--ad-orange)",
            strokeWidth: 2,
            r: 4
          }}
          activeDot={{
            fill: "var(--ad-orange)",
            strokeWidth: 2,
            r: 6
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
