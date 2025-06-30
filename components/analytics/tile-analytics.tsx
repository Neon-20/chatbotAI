"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  getTileAnalytics,
  getTileClickSummary,
  TileAnalytics
} from "@/db/tile-insights"
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
import { MousePointer, Users, TrendingUp, Target } from "lucide-react"
import { formatNumber } from "./key-metrics"

interface TileAnalyticsProps {
  workspaceId?: string
}

const COLORS = [
  "#e84315",
  "#ff6b00",
  "#ffb81c",
  "#004851",
  "#443627",
  "#8b5cf6"
]

export function TileAnalytics({ workspaceId }: TileAnalyticsProps) {
  const [analytics, setAnalytics] = useState<TileAnalytics[]>([])
  const [summary, setSummary] = useState({
    totalClicks: 0,
    uniqueUsers: 0,
    topTile: null as string | null,
    clicksByTile: {} as Record<string, number>
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange, workspaceId])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const days = parseInt(timeRange)
      const startDate = new Date(
        Date.now() - days * 24 * 60 * 60 * 1000
      ).toISOString()

      const [analyticsData, summaryData] = await Promise.all([
        getTileAnalytics(startDate, undefined, workspaceId),
        getTileClickSummary(days, workspaceId)
      ])

      setAnalytics(analyticsData)
      setSummary(summaryData)
    } catch (err) {
      console.error("Error fetching tile analytics:", err)
      setError("Failed to load tile analytics")
    } finally {
      setLoading(false)
    }
  }

  const chartData = analytics.map(tile => ({
    name: tile.tile_name,
    clicks: tile.total_clicks,
    users: tile.unique_users,
    avgClicks: tile.avg_clicks_per_user
  }))

  const pieData = analytics.map((tile, index) => ({
    name: tile.tile_name,
    value: tile.total_clicks,
    color: COLORS[index % COLORS.length]
  }))

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Suggestion Tiles Analytics</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 h-8 w-1/2 rounded bg-gray-200"></div>
                <div className="h-3 w-full rounded bg-gray-200"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Suggestion Tiles Analytics</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button onClick={fetchAnalytics} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Suggestion Tiles Analytics</h2>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#e84315] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium opacity-90">
              <MousePointer className="size-5" />
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {formatNumber(summary.totalClicks)}
            </div>
            <p className="mt-1 text-sm opacity-80">All tile interactions</p>
          </CardContent>
        </Card>

        <Card className="bg-[#004851] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium opacity-90">
              <Users className="size-5" />
              Unique Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {formatNumber(summary.uniqueUsers)}
            </div>
            <p className="mt-1 text-sm opacity-80">Users who clicked tiles</p>
          </CardContent>
        </Card>

        <Card className="bg-[#ffb81c] text-black">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium opacity-90">
              <Target className="size-5" />
              Most Popular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold tracking-tight">
              {summary.topTile || "No data"}
            </div>
            <p className="mt-1 text-sm opacity-80">Top performing tile</p>
          </CardContent>
        </Card>

        <Card className="bg-[#443627] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium opacity-90">
              <TrendingUp className="size-5" />
              Avg. per User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {summary.uniqueUsers > 0
                ? (summary.totalClicks / summary.uniqueUsers).toFixed(1)
                : "0"}
            </div>
            <p className="mt-1 text-sm opacity-80">Clicks per user</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Tile</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#e84315" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Click Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Tile Name</th>
                  <th className="p-2 text-left">Total Clicks</th>
                  <th className="p-2 text-left">Unique Users</th>
                  <th className="p-2 text-left">Avg. Clicks/User</th>
                  <th className="p-2 text-left">Last Clicked</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((tile, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{tile.tile_name}</td>
                    <td className="p-2">{formatNumber(tile.total_clicks)}</td>
                    <td className="p-2">{formatNumber(tile.unique_users)}</td>
                    <td className="p-2">{tile.avg_clicks_per_user}</td>
                    <td className="p-2">
                      {new Date(tile.last_clicked).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
