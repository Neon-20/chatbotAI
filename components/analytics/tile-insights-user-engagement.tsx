"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserTileEngagement, getTileClickCounts } from "@/db/tile-insights"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, MousePointer, TrendingUp, Award } from "lucide-react"

interface EngagementData {
  total_users: number
  active_users: number
  total_clicks: number
  avg_clicks_per_user: number
  most_popular_tile: string
}

interface TileRanking {
  tile_name: string
  click_count: number
  rank: number
}

export function TileInsightsUserEngagement({
  selectedPeriod
}: {
  selectedPeriod?: string
}) {
  const [engagementData, setEngagementData] = useState<EngagementData | null>(
    null
  )
  const [tileRankings, setTileRankings] = useState<TileRanking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const daysBack =
          selectedPeriod === "all" ? 365 : parseInt(selectedPeriod || "30")

        // Fetch engagement stats
        const engagement = await getUserTileEngagement(daysBack)
        setEngagementData(engagement)

        // Fetch tile rankings
        const startDate =
          selectedPeriod === "all"
            ? undefined
            : new Date(
                Date.now() - daysBack * 24 * 60 * 60 * 1000
              ).toISOString()

        const clickCounts = await getTileClickCounts(startDate)
        const rankings = clickCounts.map((tile, index) => ({
          tile_name: tile.tile_name,
          click_count: tile.click_count,
          rank: index + 1
        }))
        setTileRankings(rankings)
      } catch (error) {
        console.error("Error fetching user engagement data:", error)
        setEngagementData(null)
        setTileRankings([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [selectedPeriod])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="flex h-96 animate-pulse flex-col shadow-sm">
          <CardHeader className="shrink-0">
            <div className="h-6 w-48 rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              <div className="h-4 rounded bg-gray-200"></div>
              <div className="h-4 rounded bg-gray-200"></div>
              <div className="h-4 rounded bg-gray-200"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex h-96 animate-pulse flex-col shadow-sm">
          <CardHeader className="shrink-0">
            <div className="h-6 w-48 rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 rounded bg-gray-200"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const engagementRate = engagementData
    ? engagementData.total_users > 0
      ? (
          (engagementData.active_users / engagementData.total_users) *
          100
        ).toFixed(1)
      : "0"
    : "0"

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-white"
      case 2:
        return "bg-gray-400 text-white"
      case 3:
        return "bg-amber-600 text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Award className="size-4" />
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* User Engagement Overview */}
      <Card className="flex h-96 flex-col shadow-sm transition-all hover:shadow-md">
        <CardHeader className="shrink-0">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
            <Users className="size-5" />
            User Engagement Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-center space-y-6">
          {engagementData ? (
            <>
              {/* Engagement Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Engagement Rate</span>
                  <span className="text-sm text-gray-600">
                    {engagementRate}%
                  </span>
                </div>
                <Progress value={parseFloat(engagementRate)} className="h-2" />
                <p className="text-xs text-gray-500">
                  {engagementData.active_users} of {engagementData.total_users}{" "}
                  users clicked tiles
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MousePointer className="size-4 text-blue-500" />
                    <span className="text-sm font-medium">Total Clicks</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {engagementData.total_clicks.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-green-500" />
                    <span className="text-sm font-medium">Avg/User</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {engagementData.avg_clicks_per_user}
                  </p>
                </div>
              </div>

              {/* Most Popular Tile */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2">
                  <Award className="size-4 text-yellow-500" />
                  <span className="text-sm font-medium">Most Popular Tile</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {engagementData.most_popular_tile}
                </p>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No engagement data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tile Rankings */}
      <Card className="flex h-96 flex-col shadow-sm transition-all hover:shadow-md">
        <CardHeader className="shrink-0">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
            <TrendingUp className="size-5" />
            Tile Popularity Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          {tileRankings.length > 0 ? (
            <div className="h-full space-y-3 overflow-y-auto pr-2">
              {tileRankings.map(tile => (
                <div
                  key={tile.tile_name}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`flex items-center gap-1 ${getRankBadgeColor(tile.rank)}`}
                    >
                      {getRankIcon(tile.rank)}#{tile.rank}
                    </Badge>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {tile.tile_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {tile.click_count.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No ranking data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
