import { supabase } from "@/lib/supabase/browser-client"

export async function getTotalMessages() {
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
  const totalMessages = messages ? messages.length : 0 // Default to 0 if error
  if (messagesError) {
    console.error("Error fetching messages:", messagesError.message)
  }
  return totalMessages
}

export async function getAllActiveUsers() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

  const { data: activeUsersData, error: activeUsersError } = await supabase
    .from("messages")
    .select("user_id")
    .gte("created_at", thirtyDaysAgoISO)

  const activeUsers = activeUsersData
    ? new Set(activeUsersData.map(message => message.user_id)).size
    : 0 // Count unique user_ids

  if (activeUsersError) {
    console.error("Error fetching active users:", activeUsersError.message)
  }
  return activeUsers
}

export async function getCurrentMonthMessages() {
  const today = new Date()
  const firstDayOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )
  const firstDayOfPreviousMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  )
  const firstDayOfCurrentMonthISO = firstDayOfCurrentMonth.toISOString()
  const {
    data: currentMonthMessages,
    error: currentMonthError,
    count: currentMonthCount
  } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .gte("created_at", firstDayOfCurrentMonthISO)

  if (currentMonthError) {
    console.error(
      "Error fetching current month messages:",
      currentMonthError.message
    )
  }
  const currentMonthMessageCount = currentMonthCount || 0
  return currentMonthMessageCount
}

export async function getMonthlyGrowthFormatted(
  currentMonthMessageCount: number
) {
  const today = new Date()
  const firstDayOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )
  const firstDayOfPreviousMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  )
  const firstDayOfCurrentMonthISO = firstDayOfCurrentMonth.toISOString()
  const firstDayOfPreviousMonthISO = firstDayOfPreviousMonth.toISOString()
  const {
    data: previousMonthMessages,
    error: previousMonthError,
    count: previousMonthCount
  } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .gte("created_at", firstDayOfPreviousMonthISO)
    .lt("created_at", firstDayOfCurrentMonthISO) // Less than the start of the current month

  if (previousMonthError) {
    console.error(
      "Error fetching previous month messages:",
      previousMonthError.message
    )
  }
  const previousMonthMessageCount = previousMonthCount || 0
  // Calculate monthly growth
  let monthlyGrowth = 0
  if (previousMonthMessageCount > 0) {
    monthlyGrowth =
      ((currentMonthMessageCount - previousMonthMessageCount) /
        previousMonthMessageCount) *
      100
  }
  const monthlyGrowthFormatted = monthlyGrowth.toFixed(2) + "%" // Format as percentage

  return monthlyGrowthFormatted
}
