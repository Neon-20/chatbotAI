"use client"

import { getFaro, logEvent, logError, startTrace } from "@/lib/faro"
import { createContext, useContext, ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"

type FaroContextType = {
  logEvent: typeof logEvent
  logError: typeof logError
  startTrace: typeof startTrace
}

const FaroContext = createContext<FaroContextType>({
  logEvent,
  logError,
  startTrace
})

export const useFaro = () => useContext(FaroContext)

export function FaroProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Track page views
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize Faro if not already initialized
      getFaro()

      // Log page view
      logEvent("page_view", { path: pathname })
    }
  }, [pathname])

  return (
    <FaroContext.Provider value={{ logEvent, logError, startTrace }}>
      {children}
    </FaroContext.Provider>
  )
}
