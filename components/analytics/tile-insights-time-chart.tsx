"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDailyTileClicks } from "@/db/tile-insights"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

interface DailyClickData {
  date_day: string
  tile_id: string
  tile_name: string
  click_count: number
}

interface ChartData {
  date: string
  [key: string]: string | number
}

const TILE_COLORS = [
  "#dc2626", // Primary red
  "#e84e0f", // AlterDomus orange
  "#004851", // AlterDomus teal
  "#ffb81c", // AlterDomus gold
  "#7c3aed", // Purple
  "#059669" // Green
]

export function TileInsightsTimeChart({
  selectedPeriod
}: {
  selectedPeriod?: string
}) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [tileNames, setTileNames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const daysBack =
          selectedPeriod === "all" ? 365 : parseInt(selectedPeriod || "30")
        const dailyData = await getDailyTileClicks(daysBack)

        // Group data by date and tile
        const groupedData: { [date: string]: { [tileName: string]: number } } =
          {}
        const uniqueTileNames = new Set<string>()

        dailyData.forEach(item => {
          const date = new Date(item.date_day).toLocaleDateString()
          if (!groupedData[date]) {
            groupedData[date] = {}
          }
          groupedData[date][item.tile_name] = item.click_count
          uniqueTileNames.add(item.tile_name)
        })

        // Convert to chart format
        const chartDataArray: ChartData[] = Object.keys(groupedData)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map(date => {
            const dayData: ChartData = { date }
            Array.from(uniqueTileNames).forEach(tileName => {
              dayData[tileName] = groupedData[date][tileName] || 0
            })
            return dayData
          })

        setChartData(chartDataArray)
        setTileNames(Array.from(uniqueTileNames))
      } catch (error) {
        console.error("Error fetching daily tile clicks:", error)
        setChartData([])
        setTileNames([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [selectedPeriod])

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 rounded bg-gray-200"></div>
          <div className="h-4 w-64 rounded bg-gray-200"></div>
        </CardHeader>
        <CardContent>
          <div className="h-72 rounded bg-gray-200"></div>
        </CardContent>
      </Card>
    )
  }

  const formatTileName = (name: string) => {
    // Truncate long tile names for legend
    return name.length > 20 ? name.substring(0, 20) + "..." : name
  }

  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
          Tile Clicks Over Time
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Daily click trends for each suggestion tile
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--ad-gray-200)" />
            <XAxis
              dataKey="date"
              stroke="var(--ad-gray-600)"
              tick={{ fontSize: 12 }}
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
                formatTileName(name)
              ]}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            <Legend
              formatter={(value: string) => formatTileName(value)}
              wrapperStyle={{ fontSize: "12px" }}
            />
            {tileNames.map((tileName, index) => (
              <Line
                key={tileName}
                type="monotone"
                dataKey={tileName}
                stroke={TILE_COLORS[index % TILE_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
