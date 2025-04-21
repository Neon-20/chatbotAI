"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChatbotUIContext } from "@/context/context"
import { redirect } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { getMessages } from "@/db/client_admin"
import { ChartLoadingSkeleton } from "./chart-loading-skeleton"

export function ChartMessagesGrowth({
  selectedMonth
}: {
  selectedMonth?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [dataWithGrowth, setDataWithGrowth] = useState<
    Array<{ month: string; total_messages: number; growth: number }>
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const { profile } = useContext(ChatbotUIContext)

  useEffect(() => {
    if (profile?.roles !== "superadmin") {
      redirect("/login")
    }
  }, [profile])

  useEffect(() => {
    async function fetchMessages() {
      setIsLoading(true)
      try {
        const computedData = await getMessages(selectedMonth)
        if (computedData) {
          // Transform data to ensure it matches the expected format
          const formattedData = computedData.map(item => ({
            month:
              "month" in item ? item.month : (item as any).day || "Unknown",
            total_messages: item.total_messages,
            growth: item.growth
          }))
          setDataWithGrowth(formattedData)
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMessages()
  }, [selectedMonth])

  if (isLoading) {
    return <ChartLoadingSkeleton />
  }

  return (
    <>
      <Card className="h-full shadow-sm transition-all hover:shadow-md">
        <CardHeader>
          <h3 className="mb-2 text-lg font-medium">Message Volume Growth</h3>
          <p className="mb-6 text-sm text-gray-500">
            Total messages and month-over-month growth
          </p>
        </CardHeader>
        <CardContent className="grow" onClick={() => setIsOpen(true)}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dataWithGrowth}
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
                stroke="var(--ad-teal)"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="var(--ad-gold)"
                tick={{ fontSize: 12 }}
              />
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--ad-white)",
                  borderColor: "var(--ad-gray-300)"
                }}
                formatter={(value, name) => [
                  name === "total_messages"
                    ? `${value.toLocaleString()} messages`
                    : `${value}%`,
                  name === "total_messages" ? "Total Messages" : "Growth Rate"
                ]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="total_messages"
                stroke="var(--ad-teal)"
                strokeWidth={3}
                dot={{
                  fill: "var(--ad-teal)",
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
            <DialogTitle>Message Volume Growth</DialogTitle>
          </DialogHeader>
          <div className="size-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dataWithGrowth}
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
                  stroke="var(--ad-teal)"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="var(--ad-gold)"
                  tick={{ fontSize: 12 }}
                />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--ad-white)",
                    borderColor: "var(--ad-gray-300)"
                  }}
                  formatter={(value, name) => [
                    name === "total_messages"
                      ? `${value.toLocaleString()} messages`
                      : `${value}%`,
                    name === "total_messages" ? "Total Messages" : "Growth Rate"
                  ]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="total_messages"
                  stroke="var(--ad-teal)"
                  strokeWidth={3}
                  dot={{
                    fill: "var(--ad-teal)",
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
