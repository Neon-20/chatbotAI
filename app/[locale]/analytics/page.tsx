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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import Link from "next/link"
import { ChartNoAxesColumnIncreasing } from "lucide-react"
import { useState } from "react"

export default function Page() {
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-05")

  const months = [
    { value: "all", label: "All Time" },
    { value: "2024-05", label: "May 2024" },
    { value: "2024-06", label: "Jun 2024" },
    { value: "2024-07", label: "Jul 2024" },
    { value: "2024-08", label: "Aug 2024" },
    { value: "2024-09", label: "Sep 2024" },
    { value: "2024-10", label: "Oct 2024" },
    { value: "2024-11", label: "Nov 2024" },
    { value: "2024-12", label: "Dec 2024" },
    { value: "2025-01", label: "Jan 2025" },
    { value: "2025-02", label: "Feb 2025" },
    { value: "2025-03", label: "Mar 2025" },
    { value: "2025-04", label: "Apr 2025" },
    { value: "2025-05", label: "May 2025" }
  ]

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
                      <path d="M60.71436,21.14258A56.71492,56.71492,0,0,0,4,77.85742a1,1,0,0,0,2,0A54.71462,54.71462,0,0,1,60.71436,23.14258,33.28587,33.28587,0,0,1,94,56.42871,20.4284,20.4284,0,0,1,73.57129,76.85742,11.85753,11.85753,0,0,1,61.71436,65a7.57153,7.57153,0,0,1,7.57128-7.57129,3.29022,3.29022,0,0,1,3.28565,3.28516,1,1,0,1,0,2,0,5.2858,5.2858,0,0,0-5.28565-5.28516A9.5718,9.5718,0,0,0,59.71436,65,13.8578,13.8578,0,0,0,73.57129,78.85742,22.42881,22.42881,0,0,0,96,56.42871,35.28624,35.28624,0,0,0,60.71436,21.14258Z"></path>
                    </g>
                  </g>
                </g>
              </svg>
              <span className="font-medium">domusAI Stats Dashboard</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/analytics/feb" target="_blank">
                <Button variant="ghost">
                  <ChartNoAxesColumnIncreasing className="mr-2" size={20} />
                  Feb Stats
                </Button>
              </Link>
              <NewChat />
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 space-y-6 p-6">
        {/* Add month filter */}
        <div className="mb-4 flex justify-end">
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

        <KeyMetrics month={selectedMonth} />
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartMessagesGrowth month={selectedMonth} />
          <ChartActiveUsers month={selectedMonth} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ChartFileTypes month={selectedMonth} />
          <ChartAreaCumulative month={selectedMonth} />
          <ChartPieTopUsers month={selectedMonth} />
        </div>
      </main>
      <footer className="mt-4 flex items-center justify-center border-t border-black py-2 text-[11px] text-black">
        domus AI is an AI tool brought to you by the Alter Domus AI Team and
        adapted by the Cloud Platform Engineering Team.
      </footer>
    </div>
  )
}
