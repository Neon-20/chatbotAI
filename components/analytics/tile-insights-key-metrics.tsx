"use client"
import { useState, useEffect, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTileStatistics } from "@/db/tile-insights"
import { MousePointer, Users, BarChart3, TrendingUp } from "lucide-react"

type MetricsTypes = {
  title: string
  value: number | string
  description: string
  className: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
}[]

const TileInsightsKeyMetricsComponent = ({
  selectedPeriod
}: {
  selectedPeriod?: string
}) => {
  const [metrics, setMetrics] = useState<MetricsTypes>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const daysBack =
          selectedPeriod === "all" ? 365 : parseInt(selectedPeriod || "30")
        const stats = await getTileStatistics(daysBack)

        const avgClicksPerUser =
          stats.uniqueUsers > 0
            ? (stats.totalClicks / stats.uniqueUsers).toFixed(1)
            : "0"

        const mostPopularTile =
          stats.tileClickCounts.length > 0
            ? stats.tileClickCounts[0].tile_name
            : "No data"

        const data = [
          {
            title: "Total Tile Clicks",
            value: stats.totalClicks,
            description: `Clicks in ${stats.period}`,
            className: "bg-[#004851] text-white",
            icon: MousePointer,
            iconColor: "text-white"
          },
          {
            title: "Active Users",
            value: stats.uniqueUsers,
            description: `Users who clicked tiles`,
            className: "bg-[#e84e0f] text-white",
            icon: Users,
            iconColor: "text-white"
          },
          {
            title: "Avg. Clicks/User",
            value: avgClicksPerUser,
            description: "Average clicks per active user",
            className: "bg-[#ffb81c] text-black",
            icon: BarChart3,
            iconColor: "text-black"
          },
          {
            title: "Most Popular Tile",
            value:
              mostPopularTile.length > 20
                ? mostPopularTile.substring(0, 20) + "..."
                : mostPopularTile,
            description: "Highest click count",
            className: "bg-[#443627] text-white",
            icon: TrendingUp,
            iconColor: "text-white"
          }
        ]
        setMetrics(data)
      } catch (error) {
        console.error("Error fetching tile insights metrics:", error)
        // Set default empty metrics on error (table might not exist yet)
        setMetrics([
          {
            title: "Total Tile Clicks",
            value: 0,
            description: "No data available",
            className: "bg-[#004851] text-white",
            icon: MousePointer,
            iconColor: "text-white"
          },
          {
            title: "Active Users",
            value: 0,
            description: "No data available",
            className: "bg-[#e84e0f] text-white",
            icon: Users,
            iconColor: "text-white"
          },
          {
            title: "Avg. Clicks/User",
            value: "0",
            description: "No data available",
            className: "bg-[#ffb81c] text-black",
            icon: BarChart3,
            iconColor: "text-black"
          },
          {
            title: "Most Popular Tile",
            value: "No data",
            description: "No data available",
            className: "bg-[#443627] text-white",
            icon: TrendingUp,
            iconColor: "text-white"
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [selectedPeriod])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
              </CardTitle>
              <div className="size-4 rounded bg-gray-200"></div>
            </CardHeader>
            <CardContent>
              <div className="mb-1 h-8 w-16 rounded bg-gray-200"></div>
              <div className="h-3 w-32 rounded bg-gray-200"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon
        return (
          <Card
            key={index}
            className={`${metric.className} shadow-sm transition-all hover:shadow-md`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <IconComponent className={`size-4 ${metric.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs opacity-90">{metric.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export const TileInsightsKeyMetrics = memo(TileInsightsKeyMetricsComponent)
