import { supabase } from "@/lib/supabase/browser-client"

export async function get30daysMessages() {
  const { count: totalMessages, error: messagesError } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
  if (messagesError) {
    console.error("Error fetching messages:", messagesError.message)
    return 0
  }
  return totalMessages || 0
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
    : 0

  if (activeUsersError) {
    console.error("Error fetching active users:", activeUsersError.message)
  }
  return activeUsers || 0
}

export async function getLast30DaysMessages() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

  const { count: totalMessages, error: messagesError } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgoISO)

  if (messagesError) {
    console.error("Error fetching messages:", messagesError.message)
    return 0
  }
  return totalMessages || 0
}

export async function getCurrentMonthMessages() {
  const today = new Date()
  const firstDayOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )
  const firstDayOfCurrentMonthISO = firstDayOfCurrentMonth.toISOString()
  const {
    data: currentMonthMessages,
    error: currentMonthError,
    count: currentMonthCount
  } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
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
  const { error: previousMonthError, count: previousMonthCount } =
    await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
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

export async function getYearMessages() {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const oneYearAgoISO = oneYearAgo.toISOString()

  const { data: messages, error } = await supabase
    .from("messages")
    .select("created_at, user_id")
    .gte("created_at", oneYearAgoISO)

  if (error) {
    console.error("Error fetching messages:", error.message)
  }

  const monthMap: Record<string, Set<string>> = {}
  messages?.forEach((msg: { created_at: string; user_id: string }) => {
    const date = new Date(msg.created_at)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    if (!monthMap[month]) {
      monthMap[month] = new Set()
    }
    monthMap[month].add(msg.user_id)
  })
  const chartActiveUsersData = Object.entries(monthMap)
    .map(([month, users]) => ({ month, active_users: users.size }))
    .sort((a, b) => (a.month > b.month ? 1 : -1))

  return chartActiveUsersData
}

export async function getFilesType() {
  const { data: files, error: filesErr } = await supabase
    .from("files")
    .select("type")

  if (filesErr) {
    console.error("Error fetching file types:", filesErr.message)
  }

  const counts: Record<string, number> = {}
  files?.forEach(row => {
    const type = row.type || "Other"
    counts[type] = (counts[type] || 0) + 1
  })

  const fileTypeData = Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)

  return fileTypeData
}
export async function getMessages() {
  // Fetch all messages with created_at
  const { data, error } = await supabase.from("messages").select("created_at")
  if (error) {
    console.error("Error fetching messages:", error.message)
    return
  }

  // Group messages by month (format YYYY-MM)
  const monthlyMap: Record<string, number> = {}
  data?.forEach(msg => {
    const date = new Date(msg.created_at)
    const month = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`
    monthlyMap[month] = (monthlyMap[month] || 0) + 1
  })

  // Convert to sorted array
  const sortedMonths = Object.keys(monthlyMap).sort()
  const monthlyData = sortedMonths.map(month => ({
    month,
    total_messages: monthlyMap[month]
  }))

  // Calculate growth percentages
  const computedData = monthlyData.map((item, index) => {
    if (index === 0) return { ...item, growth: 0 }
    const previous = monthlyData[index - 1].total_messages
    const growth =
      previous > 0
        ? Math.round(((item.total_messages - previous) / previous) * 100)
        : 0
    return { ...item, growth }
  })

  return computedData
}

export async function getCumulativeData() {
  // Fetch messages with created_at field
  const { data: messages, error } = await supabase
    .from("messages")
    .select("created_at")
  if (error) {
    console.error("Error fetching messages:", error.message)
    return
  }
  // Group messages by month
  const monthlyMap: Record<string, number> = {}
  messages?.forEach((msg: { created_at: string }) => {
    const date = new Date(msg.created_at)
    const month = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`
    monthlyMap[month] = (monthlyMap[month] || 0) + 1
  })
  // Sort months and compute cumulative count
  const sortedMonths = Object.keys(monthlyMap).sort()
  let cumulative = 0
  const cumulativeData = sortedMonths.map(month => {
    cumulative += monthlyMap[month]
    return { month, messages: cumulative }
  })
  return cumulativeData
}

export async function getTopUsers() {
  const { data, error } = await supabase.from("messages").select("user_id")
  if (error) {
    console.error("Error fetching messages:", error.message)
    return
  }
  const userCounts: Record<string, number> = {}
  data?.forEach(row => {
    const user = row.user_id || "Unknown"
    userCounts[user] = (userCounts[user] || 0) + 1
  })
  // Build sorted array
  const usersArray = Object.entries(userCounts)
    .map(([user, count], index) => ({
      name: `User ${index + 1}`,
      value: count
    }))
    .sort((a, b) => b.value - a.value)
  // Top 5 and rest as "Others"
  const topUsers = usersArray.slice(0, 5)
  const othersTotal = usersArray
    .slice(5)
    .reduce((sum, entry) => sum + entry.value, 0)
  if (othersTotal > 0) {
    topUsers.push({ name: "Others", value: othersTotal })
  }
  return topUsers
}
