"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function ChartAreaCumulative() {
  // Dynamic data state replacing static data
  const [data, setData] = useState<Array<{ month: string; messages: number }>>(
    []
  )
  const [isOpen, setIsOpen] = useState(false) // added state for dialog

  useEffect(() => {
    async function fetchMessages() {
      // Fetch messages with created_at field
      const { data: messages, error } = await supabase
        .from("messages")
        .select("created_at")
      if (error) {
        console.error("Error fetching messages:", error.message)
        return
      }
      // Group messages by month
      const monthlyMap: Record<string, number> = {}
      messages?.forEach((msg: { created_at: string }) => {
        const date = new Date(msg.created_at)
        const month = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`
        monthlyMap[month] = (monthlyMap[month] || 0) + 1
      })
      // Sort months and compute cumulative count
      const sortedMonths = Object.keys(monthlyMap).sort()
      let cumulative = 0
      const cumulativeData = sortedMonths.map(month => {
        cumulative += monthlyMap[month]
        return { month, messages: cumulative }
      })
      setData(cumulativeData)
    }
    fetchMessages()
  }, [])

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <h3 className="mb-2 text-lg font-medium">
            Cumulative Message Growth
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            Total messages sent over time
          </p>
        </CardHeader>
        <CardContent className="grow" onClick={() => setIsOpen(true)}>
          {" "}
          {/* added onClick */}
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--ad-gray-200)"
              />
              <XAxis dataKey="month" stroke="var(--ad-gray-600)" />
              <YAxis stroke="var(--ad-gray-600)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--ad-white)",
                  borderColor: "var(--ad-gray-300)"
                }}
              />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="var(--ad-orange)"
                fill="var(--ad-orange)"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {" "}
        {/* added dialog */}
        <DialogContent className="h-[80vh] w-[1200px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Cumulative Message Growth</DialogTitle>
          </DialogHeader>
          <div className="size-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--ad-gray-200)"
                />
                <XAxis dataKey="month" stroke="var(--ad-gray-600)" />
                <YAxis stroke="var(--ad-gray-600)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--ad-white)",
                    borderColor: "var(--ad-gray-300)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="var(--ad-orange)"
                  fill="var(--ad-orange)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
