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
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

export function ChartActiveUsers({
  chartData
}: {
  chartData: Array<{ month: string; active_users: number }>
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card className="h-full shadow-sm transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-ad-teal">Monthly Active Users</CardTitle>
          <CardDescription>Growth in active users over time</CardDescription>
        </CardHeader>
        {/* Trigger dialog on click */}
        <CardContent className="grow" onClick={() => setIsOpen(true)}>
          <ActiveUsersChart data={chartData} />
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[80vh] w-[1200px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Monthly Active Users</DialogTitle>
          </DialogHeader>
          <div className="size-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--ad-gray-200)"
                />
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
                  formatter={(value: number) => [
                    `${value} users`,
                    "Active Users"
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="active_users"
                  stroke="var(--ad-orange)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </>
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
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
