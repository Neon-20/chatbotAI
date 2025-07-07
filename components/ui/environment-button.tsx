"use client"

import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

export default function EnvironmentButton() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <a href="/login" className="inline-block w-full max-w-xs">
        <button className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
          <span className="opacity-0">Get Started with Prod</span>
          <ArrowRight className="ml-2 size-4" />
        </button>
      </a>
    )
  }

  // Get environment-specific button text
  const getButtonText = () => {
    const environmentUrl = process.env.NEXT_PUBLIC_ENVIRONMENT
    // Check if URL contains 'cloud' (production) or 'dev' (development)
    const isProduction = environmentUrl?.includes("alterdomus.cloud")
    return isProduction ? "Get Started with Prod" : "Get Started."
  }

  return (
    <a href="/login" className="inline-block w-full max-w-xs">
      <button className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
        {getButtonText()}
        <ArrowRight className="ml-2 size-4" />
      </button>
    </a>
  )
}
