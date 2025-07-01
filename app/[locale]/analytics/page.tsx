"use client"
import { ChartActiveUsers } from "@/components/analytics/chart-active-users"
import { ChartAreaCumulative } from "@/components/analytics/chart-area-cumulative"
import { ChartFileTypes } from "@/components/analytics/chart-file-types"
import { ChartMessagesGrowth } from "@/components/analytics/chart-messages-growth"
import { ChartPieTopUsers } from "@/components/analytics/chart-pie-top-users"
import { KeyMetrics } from "@/components/analytics/key-metrics"
import NewChat from "@/components/analytics/newChat"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { FilterIcon, BarChart3 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function Page() {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getCurrentMonths = () => {
    const currentDate = new Date()
    const months = []

    // Add "All Time" option
    months.push({ value: "all", label: "All Time" })

    // Generate previous 11 months plus current month (total 12 months)
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate)
      date.setMonth(currentDate.getMonth() - i)

      const year = date.getFullYear()
      const month = date.getMonth() + 1 // JavaScript months are 0-indexed

      const monthName = date.toLocaleString("default", { month: "long" })
      const value = `${year}-${month.toString().padStart(2, "0")}`
      const label = `${monthName} ${year}`

      months.push({ value, label })
    }

    return months
  }

  const months = getCurrentMonths()

  return (
    <div className="min-h-screen">
      <header className="w-screen bg-[#004D4D] text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="73 101.70 154 96.61"
                preserveAspectRatio="xMidYMid meet"
                className="size-6"
              >
                <g transform="translate(-25,101.70)">
                  <g
                    id="SvgjsG5971"
                    transform="matrix(1.6739130434782612,0,0,1.6739130434782612,91.30434782608695,-35.39084048893142)"
                    fill="currentColor"
                  >
                    <title>Sacred geometry RTE</title>
                    <g data-name="Layer 2">
                      <path d="M60.71436,21.14258A56.71492,56.71492,56.71492,0,0,0,4,77.85742a1,1,0,0,0,2,0A54.71462,54.71462,0,0,1,60.71436,23.14258,33.28587,33.28587,0,0,1,94,56.42871,20.4284,20.4284,0,0,1,73.57129,76.85742,11.85753,11.85753,0,0,1,61.71436,65a7.57153,7.57153,0,0,1,7.57128-7.57129,3.29022,3.29022,0,0,1,3.28565,3.28516,1,1,0,1,0,2,0,5.2858,5.2858,0,0,0-5.28565-5.28516A9.5718,9.5718,0,0,0,59.71436,65,13.8578,13.8578,0,0,0,73.57129,78.85742,22.42881,22.42881,0,0,0,96,56.42871,35.28624,35.28624,0,0,0,60.71436,21.14258Z"></path>
                    </g>
                  </g>
                </g>
              </svg>
              <span className="font-medium">domusAI Stats Dashboard</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/tile_insights">
                <Button variant="ghost" className="text-sm">
                  <BarChart3 className="mr-2" size={20} />
                  Tile Insights
                </Button>
              </Link>
              <NewChat />
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 space-y-6 p-6">
        {/* Filter Section */}
        <div className="mb-6 flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-200 bg-white shadow-sm"
              >
                <FilterIcon className="size-4" />
                Filter by Month
                {selectedMonth && selectedMonth !== "all" && (
                  <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                    {
                      months
                        .find(m => m.value === selectedMonth)
                        ?.label.split(" ")[0]
                    }
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Select Month</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4 py-4">
                {months.map(month => (
                  <Button
                    key={month.value}
                    variant={
                      selectedMonth === month.value ? "default" : "outline"
                    }
                    className={cn(
                      "h-12 justify-start",
                      selectedMonth === month.value &&
                        "bg-primary text-primary-foreground"
                    )}
                    onClick={() => {
                      setSelectedMonth(month.value)
                      setIsDialogOpen(false)
                    }}
                  >
                    {month.label}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Add month filter dropdown (keeping this for mobile compatibility) */}
        <div className="mb-4 flex justify-end md:hidden">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <KeyMetrics selectedMonth={selectedMonth} />
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartMessagesGrowth selectedMonth={selectedMonth} />
          <ChartActiveUsers selectedMonth={selectedMonth} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ChartFileTypes selectedMonth={selectedMonth} />
          <ChartAreaCumulative selectedMonth={selectedMonth} />
          <ChartPieTopUsers selectedMonth={selectedMonth} />
        </div>
      </main>
      <footer className="mt-4 flex items-center justify-center border-t border-black py-2 text-[11px] text-black">
        domusAI is an AI tool brought to you by the Alter domusAI Team and
        adapted by the Cloud Platform Engineering Team.
      </footer>
    </div>
  )
}
