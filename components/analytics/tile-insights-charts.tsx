"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTileClickCounts } from "@/db/tile-insights"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

interface TileClickData {
  tile_id: string
  tile_name: string
  click_count: number
}

const COLORS = [
  "#dc2626", // Primary red
  "#e84e0f", // AlterDomus orange
  "#004851", // AlterDomus teal
  "#ffb81c", // AlterDomus gold
  "#7c3aed", // Purple
  "#059669" // Green
]

export function TileInsightsCharts({
  selectedPeriod
}: {
  selectedPeriod?: string
}) {
  const [tileData, setTileData] = useState<TileClickData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const daysBack =
          selectedPeriod === "all"
            ? undefined
            : parseInt(selectedPeriod || "30")
        const startDate = daysBack
          ? new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString()
          : undefined

        const data = await getTileClickCounts(startDate)
        setTileData(data)
      } catch (error) {
        console.error("Error fetching tile click data:", error)
        setTileData([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [selectedPeriod])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 rounded bg-gray-200"></div>
            <div className="h-4 w-64 rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent>
            <div className="h-80 rounded bg-gray-200"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 rounded bg-gray-200"></div>
            <div className="h-4 w-64 rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded bg-gray-200"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatTileName = (name: string) => {
    // Truncate long tile names for better display
    return name.length > 15 ? name.substring(0, 15) + "..." : name
  }

  const totalClicks = tileData.reduce((sum, tile) => sum + tile.click_count, 0)

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <Card className="flex h-96 flex-col shadow-sm transition-all hover:shadow-md">
        <CardHeader className="shrink-0">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
            Tile Popularity (Bar Chart)
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click counts for each suggestion tile
          </p>
        </CardHeader>
        <CardContent className="flex flex-1 items-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tileData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--ad-gray-200)"
              />
              <XAxis
                dataKey="tile_name"
                stroke="var(--ad-gray-600)"
                tick={{ fontSize: 12 }}
                tickFormatter={formatTileName}
              />
              <YAxis stroke="var(--ad-gray-600)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--ad-white)",
                  borderColor: "var(--ad-gray-300)",
                  borderRadius: "8px"
                }}
                formatter={(value: number, name: string) => [
                  `${value} clicks`,
                  "Click Count"
                ]}
                labelFormatter={(label: string) => `Tile: ${label}`}
              />
              <Bar dataKey="click_count" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="flex h-96 flex-col shadow-sm transition-all hover:shadow-md">
        <CardHeader className="shrink-0">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
            Tile Usage Distribution
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Percentage breakdown of tile clicks
          </p>
        </CardHeader>
        <CardContent className="flex flex-1 items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tileData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ tile_name, click_count }) =>
                  `${formatTileName(tile_name)}: ${((click_count / totalClicks) * 100).toFixed(1)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="click_count"
              >
                {tileData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value} clicks (${((value / totalClicks) * 100).toFixed(1)}%)`,
                  "Click Count"
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
