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
  Line,
  Legend
} from "recharts"
import { useEffect, useState, useContext } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { getTotalUsers } from "@/db/client_admin"
import { ChartLoadingSkeleton } from "./chart-loading-skeleton"
import { ChatbotUIContext } from "@/context/context"
import { redirect } from "next/navigation"

type TotalUsersData = Array<{
  month: string
  total_users: number
  growth: number
}>

// Custom legend component
const CustomLegend = () => (
  <div className="flex justify-center gap-6 pb-4">
    <div className="flex items-center gap-2">
      <div className="size-3 rounded-full bg-[var(--ad-orange)]"></div>
      <span className="text-sm text-gray-600">Total Users</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="size-3 rounded-full bg-[var(--ad-gold)]"></div>
      <span className="text-sm text-gray-600">Growth Rate</span>
    </div>
  </div>
)

export function ChartTotalUsers({ selectedMonth }: { selectedMonth?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [chartData, setChartData] = useState<TotalUsersData>([])
  const [isLoading, setIsLoading] = useState(true)
  const { profile } = useContext(ChatbotUIContext)

  useEffect(() => {
    if (profile?.roles !== "superadmin") {
      redirect("/login")
    }
  }, [profile])

  useEffect(() => {
    async function fetchChartData() {
      setIsLoading(true)
      try {
        const chartTotalUsersData = await getTotalUsers(selectedMonth)
        setChartData(chartTotalUsersData || [])
      } catch (error) {
        console.error("Error fetching total users data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchChartData()
  }, [selectedMonth])

  if (isLoading) {
    return <ChartLoadingSkeleton />
  }

  return (
    <>
      <Card className="h-full shadow-sm transition-all hover:shadow-md">
        <CardHeader>
          <h3 className="mb-2 text-lg font-medium">Total Users Growth</h3>
          <p className="mb-6 text-sm text-gray-500">
            Total registered users and month-over-month growth
          </p>
        </CardHeader>
        {/* Trigger dialog on click */}
        <CardContent className="grow" onClick={() => setIsOpen(true)}>
          <ResponsiveContainer width="100%" height={300}>
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
              <YAxis
                yAxisId="left"
                stroke="var(--ad-orange)"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="var(--ad-gold)"
                tick={{ fontSize: 12 }}
              />
              <Legend content={<CustomLegend />} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--ad-white)",
                  borderColor: "var(--ad-gray-300)"
                }}
                formatter={(value, name) => [
                  name === "total_users"
                    ? `${value.toLocaleString()} users`
                    : `${value}%`,
                  name === "total_users" ? "Total Users" : "Growth Rate"
                ]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="total_users"
                stroke="var(--ad-orange)"
                strokeWidth={3}
                dot={{
                  fill: "var(--ad-orange)",
                  strokeWidth: 2,
                  r: 4
                }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="growth"
                stroke="var(--ad-gold)"
                strokeWidth={2}
                dot={{
                  fill: "var(--ad-gold)",
                  strokeWidth: 2,
                  r: 4
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[80vh] w-[1200px] max-w-[90vw]">
          <DialogHeader>
            <h3 className="mb-2 text-lg font-medium">Total Users Growth</h3>
            <p className="mb-6 text-sm text-gray-500">
              Total registered users and month-over-month growth
            </p>
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
                <YAxis
                  yAxisId="left"
                  stroke="var(--ad-orange)"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="var(--ad-gold)"
                  tick={{ fontSize: 12 }}
                />
                <Legend content={<CustomLegend />} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--ad-white)",
                    borderColor: "var(--ad-gray-300)"
                  }}
                  formatter={(value, name) => [
                    name === "total_users"
                      ? `${value.toLocaleString()} users`
                      : `${value}%`,
                    name === "total_users" ? "Total Users" : "Growth Rate"
                  ]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="total_users"
                  stroke="var(--ad-orange)"
                  strokeWidth={3}
                  dot={{
                    fill: "var(--ad-orange)",
                    strokeWidth: 2,
                    r: 4
                  }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growth"
                  stroke="var(--ad-gold)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--ad-gold)",
                    strokeWidth: 2,
                    r: 4
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
