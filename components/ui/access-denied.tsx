"use client"

import { ShieldX, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AccessDeniedProps {
  title?: string
  message?: string
  showBackButton?: boolean
  showHomeButton?: boolean
  backUrl?: string
}

const AccessDeniedComponent = ({
  title = "Access Denied",
  message = "You don't have permission to access this page. Please contact your administrator if you believe this is an error.",
  showBackButton = true,
  showHomeButton = true,
  backUrl = "/"
}: AccessDeniedProps) => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-md border-0 bg-white shadow-none dark:bg-gray-900">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
            <ShieldX className="size-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="leading-relaxed text-gray-600 dark:text-gray-400">
            {message}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {showBackButton && (
              <Link href={backUrl}>
                <Button
                  variant="outline"
                  className="w-full border-gray-200 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Go Back
                </Button>
              </Link>
            )}

            {showHomeButton && (
              <Link href="/">
                <Button className="w-full bg-[#dc2626] text-white hover:bg-[#dc2626]/90 sm:w-auto">
                  <Home className="mr-2 size-4" />
                  Go Home
                </Button>
              </Link>
            )}
          </div>

          <div className="pt-4 text-xs text-gray-500 dark:text-gray-400">
            If you need access to this page, please contact your system
            administrator.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Memoize the component for better performance
export const AccessDenied = memo(AccessDeniedComponent)
