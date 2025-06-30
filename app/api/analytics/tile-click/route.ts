import { trackTileClick } from "@/db/tile-insights"
import { createRouteHandlerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const { workspace_id, tile_name, tile_index, user_agent, session_id } = json

    // Validate required fields
    if (!workspace_id || !tile_name || tile_index === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields: workspace_id, tile_name, tile_index"
        },
        { status: 400 }
      )
    }

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

    // Track the tile click
    const result = await trackTileClick({
      workspace_id,
      tile_name,
      tile_index,
      user_agent: user_agent || request.headers.get("user-agent") || undefined,
      session_id
    })

    if (!result) {
      return NextResponse.json(
        { error: "Failed to track tile click" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: result })
  } catch (error) {
    console.error("Error tracking tile click:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
