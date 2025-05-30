"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getTopUsers } from "@/db/client_admin"
import { useEffect, useState, useContext } from "react"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { ChartLoadingSkeleton } from "./chart-loading-skeleton"
import { ChatbotUIContext } from "@/context/context"
import { redirect } from "next/navigation"

const COLORS = [
  "var(--ad-teal)",
  "var(--ad-gold)",
  "var(--ad-orange)",
  "var(--ad-gray-400)",
  "var(--ad-gray-600)",
  "var(--ad-gray-300)"
]

export function ChartPieTopUsers({
  selectedMonth
}: {
  selectedMonth?: string
}) {
  const [chartData, setChartData] = useState<
    Array<{ name: string; value: number }>
  >([])
  // Add dialog open state
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { profile } = useContext(ChatbotUIContext)

  useEffect(() => {
    if (profile?.roles !== "superadmin") {
      redirect("/login")
    }
  }, [profile])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const topUsers = await getTopUsers(selectedMonth)
        if (topUsers) setChartData(topUsers)
      } catch (error) {
        console.error("Error fetching top users data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [selectedMonth])

  if (isLoading) {
    return <ChartLoadingSkeleton />
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <h3 className="mb-2 text-lg font-medium">Top Users Distribution</h3>
          <p className="mb-6 text-sm text-gray-500">
            Message distribution among top 5 users and others
          </p>
        </CardHeader>
        <CardContent
          className="h-[300px] w-full grow"
          onClick={() => setIsOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            style={{ cursor: "pointer" }}
          >
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[80vh] w-[800px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Top Users Distribution</DialogTitle>
          </DialogHeader>
          {/* Enlarge the pie chart for detailed view */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={240}
                innerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={entry => entry.name}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </DialogContent>
      </Dialog>
    </>
  )
}
