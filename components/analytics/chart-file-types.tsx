"use client"
import { useState } from "react"
import {
  Bar,
  BarChart,
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

export async function ChartFileTypes({
  fileTypeData
}: {
  fileTypeData: Array<{ type: string; count: number }>
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card className="h-full shadow-sm transition-all hover:shadow-md">
        <CardHeader>
          <h3 className="mb-2 text-lg font-medium">File Type Distribution</h3>
          <p className="mb-6 text-sm text-gray-500">Number of files by type</p>
        </CardHeader>
        <CardContent className="grow" onClick={() => setIsOpen(true)}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={fileTypeData}
              margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--ad-gray-200)"
              />
              <XAxis type="number" stroke="var(--ad-gray-600)" />
              <YAxis
                type="category"
                dataKey="type"
                width={100}
                stroke="var(--ad-gray-600)"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--ad-white)",
                  borderColor: "var(--ad-gray-300)"
                }}
                formatter={value => [`${value} files`, "Count"]}
              />
              <Bar
                dataKey="count"
                fill="var(--ad-teal)"
                radius={[0, 4, 4, 0]}
                label={{
                  position: "right",
                  fill: "var(--ad-gray-600)",
                  fontSize: 12
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[80vh] w-[1200px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>File Type Distribution</DialogTitle>
          </DialogHeader>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={fileTypeData}
              margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--ad-gray-200)"
              />
              <XAxis type="number" stroke="var(--ad-gray-600)" />
              <YAxis
                type="category"
                dataKey="type"
                width={100}
                stroke="var(--ad-gray-600)"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--ad-white)",
                  borderColor: "var(--ad-gray-300)"
                }}
                formatter={value => [`${value} files`, "Count"]}
              />
              <Bar
                dataKey="count"
                fill="var(--ad-teal)"
                radius={[0, 4, 4, 0]}
                label={{
                  position: "right",
                  fill: "var(--ad-gray-600)",
                  fontSize: 12
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </DialogContent>
      </Dialog>
    </>
  )
}
