"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"
import { FC, useEffect } from "react"
import { getAppInsights } from "@/lib/appInsights"
import { getFaro } from "@/lib/faro"

export const Providers: FC<ThemeProviderProps> = ({ children, ...props }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize Application Insights
      const appInsights = getAppInsights() // Get the singleton instance
      appInsights.trackPageView() // Track the initial page view

      // Initialize Grafana Faro
      getFaro() // Initialize Faro
    }
  }, [])

  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  )
}
