"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"
import { FC, useEffect } from "react"
import { getAppInsights } from "@/lib/appInsights"

export const Providers: FC<ThemeProviderProps> = ({ children, ...props }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const appInsights = getAppInsights() // Get the singleton instance
      appInsights.trackPageView() // Track the initial page view
    }
  }, [])

  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  )
}
