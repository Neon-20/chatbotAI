"use client"
import { useEffect, useState, useContext, useMemo } from "react"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getFilesType } from "@/db/client_admin"
import { ChartLoadingSkeleton } from "./chart-loading-skeleton"
import { ChatbotUIContext } from "@/context/context"
import { redirect } from "next/navigation"
import { Search, FileText, TrendingUp } from "lucide-react"

type FileTypeData = Array<{ type: string; count: number }>
type ProcessedFileTypeData = Array<{
  type: string
  count: number
  percentage: number
  color: string
}>

// Enhanced color palette for better visual distinction
const FILE_TYPE_COLORS = [
  "#dc2626", // Primary red
  "#e84e0f", // AlterDomus orange
  "#004851", // AlterDomus teal
  "#ffb81c", // AlterDomus gold
  "#7c3aed", // Purple
  "#059669", // Green
  "#0891b2", // Cyan
  "#c2410c", // Orange
  "#be185d", // Pink
  "#4338ca", // Indigo
  "#0d9488", // Teal
  "#ca8a04", // Yellow
  "#9333ea", // Violet
  "#dc2626", // Red variant
  "#16a34a" // Green variant
]

export function ChartFileTypes({ selectedMonth }: { selectedMonth?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [fileTypeData, setFileTypeData] = useState<FileTypeData>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"bar" | "pie">("bar")
  const { profile } = useContext(ChatbotUIContext)

  useEffect(() => {
    if (profile?.roles !== "superadmin") {
      redirect("/login")
    }
  }, [profile])

  useEffect(() => {
    async function fetchFileTypeData() {
      setIsLoading(true)
      try {
        const data = await getFilesType(selectedMonth)
        setFileTypeData(data || [])
      } catch (error) {
        console.error("Error fetching file type data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFileTypeData()
  }, [selectedMonth])

  // Process and aggregate data for better visualization
  const processedData = useMemo(() => {
    if (!fileTypeData.length) return []

    const totalFiles = fileTypeData.reduce((sum, item) => sum + item.count, 0)
    const sortedData = [...fileTypeData].sort((a, b) => b.count - a.count)

    // For large datasets, group smaller items into "Others"
    const threshold = Math.max(1, Math.floor(totalFiles * 0.02)) // 2% threshold
    const topItems: ProcessedFileTypeData = []
    let othersCount = 0

    sortedData.forEach((item, index) => {
      if (item.count >= threshold && topItems.length < 12) {
        topItems.push({
          type: item.type,
          count: item.count,
          percentage: (item.count / totalFiles) * 100,
          color: FILE_TYPE_COLORS[index % FILE_TYPE_COLORS.length]
        })
      } else {
        othersCount += item.count
      }
    })

    // Add "Others" category if there are grouped items
    if (othersCount > 0) {
      topItems.push({
        type: "Others",
        count: othersCount,
        percentage: (othersCount / totalFiles) * 100,
        color: "#6b7280" // Gray for others
      })
    }

    return topItems
  }, [fileTypeData])

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return processedData
    return processedData.filter(item =>
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [processedData, searchTerm])

  // Summary statistics
  const totalFiles = useMemo(
    () => fileTypeData.reduce((sum, item) => sum + item.count, 0),
    [fileTypeData]
  )

  const topFileType = useMemo(
    () =>
      fileTypeData.length > 0
        ? fileTypeData.reduce((max, item) =>
            item.count > max.count ? item : max
          )
        : null,
    [fileTypeData]
  )

  if (isLoading) {
    return <ChartLoadingSkeleton />
  }

  return (
    <>
      <Card className="h-full cursor-pointer shadow-sm transition-all hover:shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-medium">
                <FileText className="size-5 text-[#dc2626]" />
                File Type Distribution
              </h3>
              <p className="text-sm text-gray-500">
                {totalFiles.toLocaleString()} files across{" "}
                {processedData.length} types
              </p>
            </div>
            {topFileType && (
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  <TrendingUp className="mr-1 size-3" />
                  Most Common
                </Badge>
                <p className="text-sm font-medium">{topFileType.type}</p>
                <p className="text-xs text-gray-500">
                  {topFileType.count.toLocaleString()} files
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="grow" onClick={() => setIsOpen(true)}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={processedData.slice(0, 8)} // Show top 8 in preview
              margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--ad-gray-200)"
                opacity={0.5}
              />
              <XAxis
                type="number"
                stroke="var(--ad-gray-600)"
                tick={{ fontSize: 11 }}
                tickFormatter={value => value.toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="type"
                width={80}
                stroke="var(--ad-gray-600)"
                tick={{ fontSize: 11 }}
                tickFormatter={value =>
                  value.length > 12 ? value.substring(0, 12) + "..." : value
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--ad-white)",
                  borderColor: "var(--ad-gray-300)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                formatter={(value: number, _name: string, props: any) => [
                  <div key="tooltip" className="space-y-1">
                    <div className="font-medium">
                      {value.toLocaleString()} files
                    </div>
                    <div className="text-sm text-gray-500">
                      {props.payload.percentage.toFixed(1)}% of total
                    </div>
                  </div>,
                  "File Count"
                ]}
                labelFormatter={(label: string) => (
                  <div className="font-medium text-gray-900">{label}</div>
                )}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {processedData.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {processedData.length > 8 && (
            <div className="mt-2 text-center">
              <Badge variant="outline" className="text-xs">
                +{processedData.length - 8} more types • Click to view all
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-[85vh] w-[1400px] max-w-[95vw]">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <FileText className="size-6 text-[#dc2626]" />
                File Type Distribution - Detailed View
              </DialogTitle>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("bar")}
                  className={`rounded px-3 py-1 text-sm transition-colors ${
                    viewMode === "bar"
                      ? "bg-[#dc2626] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Bar Chart
                </button>
                <button
                  onClick={() => setViewMode("pie")}
                  className={`rounded px-3 py-1 text-sm transition-colors ${
                    viewMode === "pie"
                      ? "bg-[#dc2626] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pie Chart
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#dc2626]">
                  {totalFiles.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#004851]">
                  {processedData.length}
                </div>
                <div className="text-sm text-gray-600">File Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#e84e0f]">
                  {topFileType
                    ? `${((topFileType.count / totalFiles) * 100).toFixed(1)}%`
                    : "0%"}
                </div>
                <div className="text-sm text-gray-600">Top Type Share</div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search file types..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {viewMode === "bar" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 20, right: 60, left: 80, bottom: 20 }}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--ad-gray-200)"
                    opacity={0.5}
                  />
                  <XAxis
                    type="number"
                    stroke="var(--ad-gray-600)"
                    tick={{ fontSize: 12 }}
                    tickFormatter={value => value.toLocaleString()}
                  />
                  <YAxis
                    type="category"
                    dataKey="type"
                    width={120}
                    stroke="var(--ad-gray-600)"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--ad-white)",
                      borderColor: "var(--ad-gray-300)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                    formatter={(value: number, _name: string, props: any) => [
                      <div key="tooltip" className="space-y-2">
                        <div className="text-lg font-medium">
                          {value.toLocaleString()} files
                        </div>
                        <div className="text-sm text-gray-600">
                          {props.payload.percentage.toFixed(2)}% of total files
                        </div>
                        <div className="text-xs text-gray-500">
                          File type: {props.payload.type}
                        </div>
                      </div>,
                      ""
                    ]}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {filteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) =>
                      percentage > 3 ? `${type}: ${percentage.toFixed(1)}%` : ""
                    }
                    outerRadius={180}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {filteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _name: string, props: any) => [
                      <div key="tooltip" className="space-y-2">
                        <div className="text-lg font-medium">
                          {value.toLocaleString()} files
                        </div>
                        <div className="text-sm text-gray-600">
                          {props.payload.percentage.toFixed(2)}% of total
                        </div>
                      </div>,
                      props.payload.type
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend for filtered results */}
          {searchTerm && (
            <div className="mt-4 rounded-lg bg-blue-50 p-3">
              <div className="text-sm text-blue-800">
                Showing {filteredData.length} file type
                {filteredData.length !== 1 ? "s" : ""}
                matching &ldquo;{searchTerm}&rdquo;
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
