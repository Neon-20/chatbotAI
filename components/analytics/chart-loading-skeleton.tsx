import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ChartLoadingSkeleton() {
  return (
    <Card className="h-full shadow-sm">
      <CardHeader>
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-6 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="grow">
        <div className="space-y-2">
          {/* Chart area skeleton */}
          <div className="relative h-[300px] w-full overflow-hidden rounded-md">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-px w-full bg-gray-100" />
              ))}
            </div>

            {/* Vertical grid lines */}
            <div className="absolute inset-0 flex justify-between px-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-full w-px bg-gray-100" />
              ))}
            </div>

            {/* Chart line skeletons */}
            <div className="absolute inset-6">
              {/* First line (total messages) */}
              <div className="absolute size-full">
                <svg className="size-full">
                  <path
                    d="M0,80 Q40,60 80,100 T160,60 T240,80 T320,30 T400,50 T480,20"
                    fill="none"
                    stroke="var(--ad-teal)"
                    strokeOpacity="0.2"
                    strokeWidth="3"
                    strokeDasharray="6,6"
                  />
                </svg>
              </div>

              {/* Second line (growth) */}
              <div className="absolute size-full">
                <svg className="size-full">
                  <path
                    d="M0,100 Q40,120 80,90 T160,110 T240,70 T320,100 T400,80 T480,90"
                    fill="none"
                    stroke="var(--ad-gold)"
                    strokeOpacity="0.2"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                </svg>
              </div>

              {/* Animated gradient overlay for shimmer effect */}
              <div
                className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                style={{ backgroundSize: "200% 100%" }}
              />
            </div>

            {/* X-axis labels */}
            <div className="absolute inset-x-6 bottom-0 flex justify-between">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-12" />
              ))}
            </div>

            {/* Y-axis labels */}
            <div className="absolute inset-y-6 left-0 flex flex-col justify-between">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-8" />
              ))}
            </div>
          </div>

          {/* Legend skeleton */}
          <div className="flex justify-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-8 rounded-full bg-teal-200" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-8 rounded-full bg-amber-200" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
