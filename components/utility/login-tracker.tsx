"use client"

import { useFaro } from "./faro-provider"
import { useEffect } from "react"

export function LoginTracker({ userId }: { userId: string }) {
  const { logEvent } = useFaro()

  useEffect(() => {
    if (userId) {
      logEvent("user_login", { userId })
    }
  }, [userId, logEvent])

  return null
}
