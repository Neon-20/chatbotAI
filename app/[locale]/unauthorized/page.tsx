"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { IconShieldX, IconHome } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
  const router = useRouter()

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <IconShieldX className="size-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-foreground text-2xl font-semibold">
            Access Denied
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            You don&apos;t have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6 text-sm">
            This page requires specific permissions that your account
            doesn&apos;t have. Please contact your administrator if you believe
            this is an error.
          </p>
          <Button
            onClick={handleGoHome}
            className="w-full bg-[#dc2626] text-white hover:bg-[#dc2626]/90"
          >
            <IconHome className="mr-2 size-4" />
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
