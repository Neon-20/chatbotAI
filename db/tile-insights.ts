import { supabase } from "@/lib/supabase/browser-client"

// Types for tile insights
export interface TileInsight {
  id: string
  user_id: string
  tile_id: string
  tile_text: string
  tile_name: string
  session_id?: string
  user_agent?: string
  ip_address?: string
  metadata?: Record<string, any>
  username?: string
  user_role?: string
  created_at: string
  updated_at?: string
}

export interface TileClickCount {
  tile_id: string
  tile_name: string
  click_count: number
}

export interface DailyTileClick {
  date_day: string
  tile_id: string
  tile_name: string
  click_count: number
}

export interface UserEngagementStats {
  total_users: number
  active_users: number
  total_clicks: number
  avg_clicks_per_user: number
  most_popular_tile: string
}

// Insert a new tile click event
export const insertTileClick = async (tileClick: {
  tile_id: string
  tile_text: string
  tile_name: string
  session_id?: string
  user_agent?: string
  metadata?: Record<string, any>
}) => {
  try {
    // Get current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error("User not authenticated")
    }

    // Get user profile for additional info
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, roles")
      .eq("user_id", user.id)
      .single()

    const { data, error } = await supabase
      .from("tile_insights")
      .insert([
        {
          user_id: user.id,
          tile_id: tileClick.tile_id,
          tile_text: tileClick.tile_text,
          tile_name: tileClick.tile_name,
          session_id: tileClick.session_id,
          user_agent: tileClick.user_agent || navigator?.userAgent,
          metadata: tileClick.metadata || {},
          username: profile?.username,
          user_role: profile?.roles
        }
      ])
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error inserting tile click:", error)
    throw error
  }
}

// Get tile click counts (for admin/analytics)
export const getTileClickCounts = async (
  startDate?: string,
  endDate?: string
): Promise<TileClickCount[]> => {
  try {
    let query = supabase.from("tile_insights").select("tile_id, tile_name")

    if (startDate) {
      query = query.gte("created_at", startDate)
    }
    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    // Group by tile and count
    const counts: { [key: string]: { tile_name: string; count: number } } = {}
    data?.forEach(item => {
      if (!counts[item.tile_id]) {
        counts[item.tile_id] = { tile_name: item.tile_name, count: 0 }
      }
      counts[item.tile_id].count++
    })

    return Object.entries(counts)
      .map(([tile_id, info]) => ({
        tile_id,
        tile_name: info.tile_name,
        click_count: info.count
      }))
      .sort((a, b) => b.click_count - a.click_count)
  } catch (error) {
    console.error("Error getting tile click counts:", error)
    return []
  }
}

// Get daily tile clicks for time series charts
export const getDailyTileClicks = async (
  daysBack: number = 30
): Promise<DailyTileClick[]> => {
  try {
    const startDate = new Date(
      Date.now() - daysBack * 24 * 60 * 60 * 1000
    ).toISOString()

    const { data, error } = await supabase
      .from("tile_insights")
      .select("created_at, tile_id, tile_name")
      .gte("created_at", startDate)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    // Group by date and tile
    const dailyData: { [key: string]: { [tile: string]: number } } = {}
    data?.forEach(item => {
      const date = new Date(item.created_at).toISOString().split("T")[0]
      if (!dailyData[date]) {
        dailyData[date] = {}
      }
      if (!dailyData[date][item.tile_name]) {
        dailyData[date][item.tile_name] = 0
      }
      dailyData[date][item.tile_name]++
    })

    // Convert to array format
    const result: DailyTileClick[] = []
    Object.entries(dailyData).forEach(([date, tiles]) => {
      Object.entries(tiles).forEach(([tileName, count]) => {
        result.push({
          date_day: date,
          tile_id: tileName.toLowerCase().replace(/\s+/g, "_"),
          tile_name: tileName,
          click_count: count
        })
      })
    })

    return result.sort(
      (a, b) => new Date(b.date_day).getTime() - new Date(a.date_day).getTime()
    )
  } catch (error) {
    console.error("Error getting daily tile clicks:", error)
    return []
  }
}

// Get user engagement statistics
export const getUserTileEngagement = async (
  daysBack: number = 30
): Promise<UserEngagementStats | null> => {
  try {
    const startDate = new Date(
      Date.now() - daysBack * 24 * 60 * 60 * 1000
    ).toISOString()

    // Get tile insights data
    const { data: tileData, error: tileError } = await supabase
      .from("tile_insights")
      .select("user_id, tile_name")
      .gte("created_at", startDate)

    if (tileError) {
      throw new Error(tileError.message)
    }

    // Get total users count
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("roles", "user")

    if (profileError) {
      throw new Error(profileError.message)
    }

    const totalUsers = profileData?.length || 0
    const activeUsers = new Set(tileData?.map(item => item.user_id)).size
    const totalClicks = tileData?.length || 0
    const avgClicksPerUser = activeUsers > 0 ? totalClicks / activeUsers : 0

    // Find most popular tile
    const tileCounts: { [key: string]: number } = {}
    tileData?.forEach(item => {
      tileCounts[item.tile_name] = (tileCounts[item.tile_name] || 0) + 1
    })

    const mostPopularTile =
      Object.entries(tileCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "No data"

    return {
      total_users: totalUsers,
      active_users: activeUsers,
      total_clicks: totalClicks,
      avg_clicks_per_user: parseFloat(avgClicksPerUser.toFixed(2)),
      most_popular_tile: mostPopularTile
    }
  } catch (error) {
    console.error("Error getting user tile engagement:", error)
    return null
  }
}

// Get tile insights for a specific user (user can only see their own)
export const getUserTileInsights = async (
  userId?: string,
  limit: number = 100
): Promise<TileInsight[]> => {
  try {
    let query = supabase
      .from("tile_insights")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error("Error getting user tile insights:", error)
    throw error
  }
}

// Get aggregated tile statistics for admin dashboard
export const getTileStatistics = async (daysBack: number = 30) => {
  try {
    const startDate = new Date(
      Date.now() - daysBack * 24 * 60 * 60 * 1000
    ).toISOString()

    // Get basic counts
    const { data: totalClicks, error: totalError } = await supabase
      .from("tile_insights")
      .select("id", { count: "exact" })
      .gte("created_at", startDate)

    if (totalError) {
      throw new Error(totalError.message)
    }

    // Get unique users count
    const { data: uniqueUsers, error: usersError } = await supabase
      .from("tile_insights")
      .select("user_id")
      .gte("created_at", startDate)

    if (usersError) {
      throw new Error(usersError.message)
    }

    const uniqueUserCount = new Set(uniqueUsers?.map((u: any) => u.user_id))
      .size

    // Get tile click counts
    const clickCounts = await getTileClickCounts(startDate)

    // Get daily clicks
    const dailyClicks = await getDailyTileClicks(daysBack)

    return {
      totalClicks: totalClicks?.length || 0,
      uniqueUsers: uniqueUserCount,
      tileClickCounts: clickCounts,
      dailyClicks: dailyClicks,
      period: `${daysBack} days`
    }
  } catch (error) {
    console.error("Error getting tile statistics:", error)
    return {
      totalClicks: 0,
      uniqueUsers: 0,
      tileClickCounts: [],
      dailyClicks: [],
      period: `${daysBack} days`
    }
  }
}

// Helper function to generate session ID
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}
