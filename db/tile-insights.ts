import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert } from "@/supabase/types"

export interface TileClickData {
  workspace_id: string
  tile_name: string
  tile_index: number
  user_agent?: string
  session_id?: string
}

export interface TileAnalytics {
  tile_name: string
  tile_index: number
  total_clicks: number
  unique_users: number
  avg_clicks_per_user: number
  last_clicked: string
}

export interface UserTileHistory {
  tile_name: string
  tile_index: number
  clicked_at: string
  workspace_id: string
}

/**
 * Track a tile click by inserting data into tile_insights table
 */
export const trackTileClick = async (
  data: TileClickData
): Promise<string | null> => {
  try {
    const { data: result, error } = await supabase.rpc("insert_tile_click", {
      p_workspace_id: data.workspace_id,
      p_tile_name: data.tile_name,
      p_tile_index: data.tile_index,
      p_user_agent: data.user_agent || navigator.userAgent,
      p_session_id: data.session_id || generateSessionId()
    })

    if (error) {
      console.error("Error tracking tile click:", error)
      return null
    }

    return result
  } catch (error) {
    console.error("Error tracking tile click:", error)
    return null
  }
}

/**
 * Get tile analytics for admins (last 30 days by default)
 */
export const getTileAnalytics = async (
  startDate?: string,
  endDate?: string,
  workspaceId?: string
): Promise<TileAnalytics[]> => {
  try {
    const { data, error } = await supabase.rpc("get_tile_analytics", {
      p_start_date:
        startDate ||
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      p_end_date: endDate || new Date().toISOString(),
      p_workspace_id: workspaceId || null
    })

    if (error) {
      console.error("Error fetching tile analytics:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching tile analytics:", error)
    return []
  }
}

/**
 * Get user's own tile click history
 */
export const getUserTileHistory = async (
  limit: number = 50,
  offset: number = 0
): Promise<UserTileHistory[]> => {
  try {
    const { data, error } = await supabase.rpc("get_user_tile_history", {
      p_limit: limit,
      p_offset: offset
    })

    if (error) {
      console.error("Error fetching user tile history:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching user tile history:", error)
    return []
  }
}

/**
 * Get tile insights directly from the table (for admin use)
 */
export const getTileInsights = async (filters?: {
  startDate?: string
  endDate?: string
  workspaceId?: string
  tileName?: string
  userId?: string
}): Promise<any[]> => {
  try {
    let query = supabase
      .from("tile_insights")
      .select(
        `
        *,
        profiles:user_id (
          display_name,
          username
        ),
        workspaces:workspace_id (
          name
        )
      `
      )
      .order("clicked_at", { ascending: false })

    if (filters?.startDate) {
      query = query.gte("clicked_at", filters.startDate)
    }

    if (filters?.endDate) {
      query = query.lte("clicked_at", filters.endDate)
    }

    if (filters?.workspaceId) {
      query = query.eq("workspace_id", filters.workspaceId)
    }

    if (filters?.tileName) {
      query = query.eq("tile_name", filters.tileName)
    }

    if (filters?.userId) {
      query = query.eq("user_id", filters.userId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching tile insights:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching tile insights:", error)
    return []
  }
}

/**
 * Generate a simple session ID for tracking
 */
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Get tile click summary for a specific time period
 */
export const getTileClickSummary = async (
  days: number = 30,
  workspaceId?: string
): Promise<{
  totalClicks: number
  uniqueUsers: number
  topTile: string | null
  clicksByTile: Record<string, number>
}> => {
  try {
    const startDate = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000
    ).toISOString()
    const analytics = await getTileAnalytics(startDate, undefined, workspaceId)

    const totalClicks = analytics.reduce(
      (sum, tile) => sum + tile.total_clicks,
      0
    )
    const uniqueUsers = Math.max(...analytics.map(tile => tile.unique_users), 0)
    const topTile = analytics.length > 0 ? analytics[0].tile_name : null
    const clicksByTile = analytics.reduce(
      (acc, tile) => {
        acc[tile.tile_name] = tile.total_clicks
        return acc
      },
      {} as Record<string, number>
    )

    return {
      totalClicks,
      uniqueUsers,
      topTile,
      clicksByTile
    }
  } catch (error) {
    console.error("Error getting tile click summary:", error)
    return {
      totalClicks: 0,
      uniqueUsers: 0,
      topTile: null,
      clicksByTile: {}
    }
  }
}
