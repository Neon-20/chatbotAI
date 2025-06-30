import { getTileAnalytics, getTileClickSummary } from "@/db/tile-insights"
import { createRouteHandlerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get the current user
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("roles")
      .eq("user_id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (!["admin", "superadmin"].includes(profile.roles)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const workspaceId = searchParams.get("workspace_id")
    const days = parseInt(searchParams.get("days") || "30")

    // Get analytics data
    const [analytics, summary] = await Promise.all([
      getTileAnalytics(
        startDate || undefined,
        endDate || undefined,
        workspaceId || undefined
      ),
      getTileClickSummary(days, workspaceId || undefined)
    ])

    return NextResponse.json({
      analytics,
      summary,
      filters: {
        startDate,
        endDate,
        workspaceId,
        days
      }
    })
  } catch (error) {
    console.error("Error fetching tile analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
