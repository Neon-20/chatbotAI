import { IconX } from "@tabler/icons-react"
import { useCallback, useEffect, useState } from "react"

import Link from "next/link"

interface BannerProps {
  onVisibilityChange?: (isVisible: boolean) => void
}

export const AlertDialog = ({ onVisibilityChange }: BannerProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already acknowledged the alert
    const isAcknowledged = localStorage.getItem("alertDialogAcknowledged")

    // If user has not acknowledged the alert, show it
    if (!isAcknowledged) {
      setIsVisible(true)
    }
  }, [])

  useEffect(() => {
    // Notify parent about initial visibility on mount
    if (onVisibilityChange) {
      onVisibilityChange(isVisible)
    }
  }, [isVisible, onVisibilityChange])

  const handleClose = useCallback(() => {
    setIsVisible(false)

    // Notify parent component about visibility change
    if (onVisibilityChange) {
      onVisibilityChange(false)
    }
  }, [onVisibilityChange])

  const handleAcknowledge = useCallback(() => {
    // Store acknowledgment in localStorage
    localStorage.setItem("alertDialogAcknowledged", "true")
    handleClose()
    window.location.href = "https://chat.internal.alterdomus.dev/"
  }, [handleClose])

  if (!isVisible) return null

  return (
    <>
      {/* Overlay/backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ">
        {/* Dialog box */}
        <div className="mb-10 ml-72 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-200 px-4 py-3 dark:bg-red-900">
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              Important Notice
            </h3>
            <button
              onClick={handleClose}
              className="shrink-0 rounded-md p-1 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 dark:hover:bg-red-800"
              aria-label="Close dialog"
            >
              <IconX size={18} className="text-red-900 dark:text-red-100" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="whitespace-pre-line text-sm text-gray-800 dark:text-gray-200">
              <p>
                <b>domusAI&apos;s</b> data retention policy is set to 30 days.
                <br />
                Please save any necessary chats and files in the Folders within
                their respective tabs. Note that saved prompts will not be
                deleted.
              </p>
              {/* <Link href="https://chat.internal.alterdomus.dev/" className='my-2 underline'>
                https://chat.internal.alterdomus.dev/
              </Link> */}
              <p>
                Policy Implementation date: <b>23rd April 2025</b>
              </p>
            </div>
          </div>

          {/* Footer */}
          {/* <div className="flex justify-end bg-gray-50 px-4 py-3 dark:bg-gray-700">
            <button
              onClick={handleAcknowledge}
              className="rounded-md bg-red-100 px-4 py-2 text-red-900 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
            >
              Acknowledge
            </button>
          </div> */}
        </div>
      </div>
    </>
  )
}
