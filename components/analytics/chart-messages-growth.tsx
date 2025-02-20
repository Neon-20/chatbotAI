"use client"

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useState, useEffect, useContext } from "react"
import { createClient } from "@supabase/supabase-js"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { ChatbotUIContext } from "@/context/context"
import { redirect } from "next/navigation"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function ChartMessagesGrowth() {
  const [isOpen, setIsOpen] = useState(false)
  const [dataWithGrowth, setDataWithGrowth] = useState<
    Array<{ month: string; total_messages: number; growth: number }>
  >([])
  const { profile } = useContext(ChatbotUIContext)

  useEffect(() => {
    if (profile?.roles !== "superadmin") {
      redirect("/login")
    }
  }, [profile])

  useEffect(() => {
    async function fetchMessages() {
      // Fetch all messages with created_at
      const { data, error } = await supabase
        .from("messages")
        .select("created_at")
      if (error) {
        console.error("Error fetching messages:", error.message)
        return
      }

      // Group messages by month (format YYYY-MM)
      const monthlyMap: Record<string, number> = {}
      data?.forEach(msg => {
        const date = new Date(msg.created_at)
        const month = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`
        monthlyMap[month] = (monthlyMap[month] || 0) + 1
      })

      // Convert to sorted array
      const sortedMonths = Object.keys(monthlyMap).sort()
      const monthlyData = sortedMonths.map(month => ({
        month,
        total_messages: monthlyMap[month]
      }))

      // Calculate growth percentages
      const computedData = monthlyData.map((item, index) => {
        if (index === 0) return { ...item, growth: 0 }
        const previous = monthlyData[index - 1].total_messages
        const growth =
          previous > 0
            ? Math.round(((item.total_messages - previous) / previous) * 100)
            : 0
        return { ...item, growth }
      })

      setDataWithGrowth(computedData)
    }
    fetchMessages()
  }, [])

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
