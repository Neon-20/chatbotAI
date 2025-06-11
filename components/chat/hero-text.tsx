"use client"

import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useMemo } from "react"

interface HeroTextProps {}

const HERO_TEXT_OPTIONS = [
  "Welcome {username}, What's on your mind today?",
  "Welcome {username}, How can I help?",
  "Welcome {username}, Ready to Dive in?",
  "Welcome {username}, Where should we begin?",
  "Welcome {username}, What's on the agenda today?"
]

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const HeroText: FC<HeroTextProps> = ({}) => {
  const { profile } = useContext(ChatbotUIContext)

  // Generate the hero text once and memoize it
  const heroText = useMemo(() => {
    const shuffledOptions = shuffleArray(HERO_TEXT_OPTIONS)
    return shuffledOptions[0]
  }, []) // Empty dependency array - only runs once

  // Memoize the text parts to avoid unnecessary recalculations
  const textParts = useMemo(() => {
    if (heroText.includes("{username}")) {
      // Use display_name first, then username as fallback
      const fullUsername = profile?.display_name || profile?.username || "there"
      // Extract first part before the dot if it exists
      const rawUsername = fullUsername.includes(".")
        ? fullUsername.split(".")[0]
        : fullUsername
      // Capitalize the first letter
      const username =
        rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1)
      const parts = heroText.split("{username}")
      return {
        beforeUsername: parts[0] || "",
        username: username,
        afterUsername: parts[1] || ""
      }
    } else {
      return {
        beforeUsername: heroText,
        username: "",
        afterUsername: ""
      }
    }
  }, [heroText, profile?.display_name, profile?.username])

  // Always render something, even if profile is not loaded yet
  if (
    !textParts.beforeUsername &&
    !textParts.username &&
    !textParts.afterUsername
  ) {
    // Show a default message while loading
    return (
      <div className="flex flex-col items-center justify-center px-4">
        <h1 className="text-center text-2xl font-medium tracking-tight transition-all duration-300 ease-in-out sm:text-3xl md:text-4xl">
          <span className="text-black">Welcome</span>
          <span className="bg-gradient-to-r from-[#e84315] via-[#FF6B00] to-[#e84315] bg-clip-text text-transparent">
            !
          </span>
        </h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <h1 className="text-center text-xl font-medium leading-relaxed tracking-tight transition-all duration-300 ease-in-out sm:text-3xl md:text-4xl">
        {textParts.beforeUsername && (
          <span className="text-black">{textParts.beforeUsername}</span>
        )}
        {textParts.username && (
          <span
            className="mx-1 inline-block bg-gradient-to-r from-[#e84315] via-[#FF6B00] to-[#e84315] bg-clip-text text-transparent"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
              minHeight: "1.2em"
            }}
          >
            {textParts.username}
          </span>
        )}
        {textParts.afterUsername && (
          <span className="text-black">{textParts.afterUsername}</span>
        )}
      </h1>
    </div>
  )
}
