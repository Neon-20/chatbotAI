"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Link from "next/link"

interface NotificationBannerProps {
  message: string
  link?: string
  linkText?: string
  width?: string
  target?: string
  rel?: string
}

export default function NotificationBanner({
  message = "Pro blocks are now available in shadcn/ui kit for Figma!",
  link = "#",
  linkText = "",
  width = "max-w-3xl",
  target = "_blank",
  rel = "noopener noreferrer"
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  return (
    <div className="flex w-full justify-center">
      <div
        className={`${width} flex items-center justify-between rounded-xl bg-black px-3 py-1.5 text-white shadow-md`}
      >
        <div className="flex-1 text-center">
          {/* <span className="font-medium">Action Needed</span> */}
          {message}{" "}
          {linkText && (
            <Link
              href={link}
              className="inline-flex items-center"
              target={target}
              rel={rel}
            >
              <span className="ml-1 underline">{linkText}</span>
            </Link>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 rounded-sm p-1 transition-colors hover:bg-gray-800"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
