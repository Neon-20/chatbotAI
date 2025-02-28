"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/browser-client"
import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { getCumulativeData } from "@/db/admin"
export function ChartAreaCumulative() {
  // Dynamic data state replacing static data
  const [data, setData] = useState<Array<{ month: string; messages: number }>>(
    []
  )
  const [isOpen, setIsOpen] = useState(false) // added state for dialog

  useEffect(() => {
    async function fetchMessages() {
      const cumulativeData = await getCumulativeData()
      if (cumulativeData) {
        setData(cumulativeData)
      }
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
