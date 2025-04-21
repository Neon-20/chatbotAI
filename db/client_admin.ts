import { supabase } from "@/lib/supabase/browser-client"

// Helper to get date range for a month string (YYYY-MM)
function getMonthRange(month: string) {
  if (!month || month === "all") return {}
  const [year, m] = month.split("-").map(Number)
  const start = new Date(year, m - 1, 1)
  const end = new Date(year, m, 1)
  return { start: start.toISOString(), end: end.toISOString() }
}

export async function get30daysMessages(selectedMonth?: string) {
  let query = supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
  if (selectedMonth && selectedMonth !== "all") {
    const { start, end } = getMonthRange(selectedMonth)
    query = query.gte("created_at", start).lt("created_at", end)
  }
  const { count: totalMessages, error: messagesError } = await query
  if (messagesError) {
    console.error("Error fetching messages:", messagesError.message)
    return 0
  }
  return totalMessages || 0
}

export async function getAllActiveUsers(selectedMonth?: string) {
  let query = supabase.from("messages").select("user_id")
  if (selectedMonth && selectedMonth !== "all") {
    const { start, end } = getMonthRange(selectedMonth)
    query = query.gte("created_at", start).lt("created_at", end)
  } else {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    query = query.gte("created_at", thirtyDaysAgo.toISOString())
  }
  const { data: activeUsersData, error: activeUsersError } = await query
  const activeUsers = activeUsersData
    ? new Set(activeUsersData.map(message => message.user_id)).size
    : 0
  if (activeUsersError) {
    console.error("Error fetching active users:", activeUsersError.message)
  }
  return activeUsers || 0
}

export async function getLast30DaysMessages(selectedMonth?: string) {
  let query = supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
  if (selectedMonth && selectedMonth !== "all") {
    const { start, end } = getMonthRange(selectedMonth)
    query = query.gte("created_at", start).lt("created_at", end)
  } else {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    query = query.gte("created_at", thirtyDaysAgo.toISOString())
  }
  const { count: totalMessages, error: messagesError } = await query
  if (messagesError) {
    console.error("Error fetching messages:", messagesError.message)
    return 0
  }
  return totalMessages || 0
}

export async function getCurrentMonthMessages(selectedMonth?: string) {
  let query = supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
  if (selectedMonth && selectedMonth !== "all") {
    const { start, end } = getMonthRange(selectedMonth)
    query = query.gte("created_at", start).lt("created_at", end)
  } else {
    const today = new Date()
    const firstDayOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
    query = query.gte("created_at", firstDayOfCurrentMonth.toISOString())
  }
  const { count: currentMonthCount, error: currentMonthError } = await query
  if (currentMonthError) {
    console.error(
      "Error fetching current month messages:",
      currentMonthError.message
    )
  }
  return currentMonthCount || 0
}

export async function getMonthlyGrowthFormatted(
  currentMonthMessageCount: number,
  selectedMonth?: string
) {
  let previousMonthStart: string | undefined,
    previousMonthEnd: string | undefined
  if (selectedMonth && selectedMonth !== "all") {
    const [year, m] = selectedMonth.split("-").map(Number)
    const prevMonth = m === 1 ? 12 : m - 1
    const prevYear = m === 1 ? year - 1 : year
    const prevStart = new Date(prevYear, prevMonth - 1, 1)
    const prevEnd = new Date(prevYear, prevMonth, 1)
    previousMonthStart = prevStart.toISOString()
    previousMonthEnd = prevEnd.toISOString()
  } else {
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
    previousMonthStart = firstDayOfPreviousMonth.toISOString()
    previousMonthEnd = firstDayOfCurrentMonth.toISOString()
  }
  const { count: previousMonthCount, error: previousMonthError } =
    await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .gte("created_at", previousMonthStart)
      .lt("created_at", previousMonthEnd)
  if (previousMonthError) {
    console.error(
      "Error fetching previous month messages:",
      previousMonthError.message
    )
  }
  const previousMonthMessageCount = previousMonthCount || 0
  let monthlyGrowth = 0
  if (previousMonthMessageCount > 0) {
    monthlyGrowth =
      ((currentMonthMessageCount - previousMonthMessageCount) /
        previousMonthMessageCount) *
      100
  }
  return monthlyGrowth.toFixed(2) + "%"
}

export async function getYearMessages(selectedMonth?: string) {
  let query = supabase.from("messages").select("created_at, user_id")
  if (selectedMonth && selectedMonth !== "all") {
    const { start, end } = getMonthRange(selectedMonth)
    query = query.gte("created_at", start).lt("created_at", end)
  } else {
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    query = query.gte("created_at", oneYearAgo.toISOString())
  }
  const { data: messages, error } = await query
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

export async function getFilesType(selectedMonth?: string) {
  let query = supabase.from("files").select("type, created_at")
  if (selectedMonth && selectedMonth !== "all") {
    const { start, end } = getMonthRange(selectedMonth)
    query = query.gte("created_at", start).lt("created_at", end)
  }
  const { data: files, error: filesErr } = await query
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

export async function getMessages(selectedMonth?: string) {
  let query = supabase.from("messages").select("created_at")
  if (selectedMonth && selectedMonth !== "all") {
    const { start, end } = getMonthRange(selectedMonth)
    query = query.gte("created_at", start).lt("created_at", end)
  }
  const { data, error } = await query
  if (error) {
    console.error("Error fetching messages:", error.message)
    return
  }

  // If a specific month is selected, show day-by-day data
  if (selectedMonth && selectedMonth !== "all") {
    const dailyMap: Record<string, number> = {}
    data?.forEach(msg => {
      const date = new Date(msg.created_at)
      const day = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
      dailyMap[day] = (dailyMap[day] || 0) + 1
    })

    const sortedDays = Object.keys(dailyMap).sort()
    const dailyData = sortedDays.map(day => ({
      day,
      total_messages: dailyMap[day]
    }))

    const computedData = dailyData.map((item, index) => {
      if (index === 0) return { ...item, growth: 0 }
      const previous = dailyData[index - 1].total_messages
      const growth =
        previous > 0
          ? Math.round(((item.total_messages - previous) / previous) * 100)
          : 0
      return { ...item, growth, month: item.day } // Include month field for compatibility
    })
    return computedData
  }
  // Otherwise, group by month as before
  else {
    const monthlyMap: Record<string, number> = {}
    data?.forEach(msg => {
      const date = new Date(msg.created_at)
      const month = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`
      monthlyMap[month] = (monthlyMap[month] || 0) + 1
    })

    const sortedMonths = Object.keys(monthlyMap).sort()
    const monthlyData = sortedMonths.map(month => ({
      month,
      total_messages: monthlyMap[month]
    }))

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
}

export async function getCumulativeData(selectedMonth?: string) {
  let query = supabase.from("messages").select("created_at")
  if (selectedMonth && selectedMonth !== "all") {
    const { start, end } = getMonthRange(selectedMonth)
    query = query.gte("created_at", start).lt("created_at", end)
  }
  const { data: messages, error } = await query
  if (error) {
    console.error("Error fetching messages:", error.message)
    return
  }

  // If a specific month is selected, show day-by-day cumulative data
  if (selectedMonth && selectedMonth !== "all") {
    const dailyMap: Record<string, number> = {}
    messages?.forEach((msg: { created_at: string }) => {
      const date = new Date(msg.created_at)
      const day = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
      dailyMap[day] = (dailyMap[day] || 0) + 1
    })

    const sortedDays = Object.keys(dailyMap).sort()
    let cumulative = 0
    const cumulativeData = sortedDays.map(day => {
      cumulative += dailyMap[day]
      return { month: day, messages: cumulative } // Use 'month' key for compatibility
    })
    return cumulativeData
  }
  // Otherwise, group by month as before
  else {
    const monthlyMap: Record<string, number> = {}
    messages?.forEach((msg: { created_at: string }) => {
      const date = new Date(msg.created_at)
      const month = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`
      monthlyMap[month] = (monthlyMap[month] || 0) + 1
    })

    const sortedMonths = Object.keys(monthlyMap).sort()
    let cumulative = 0
    const cumulativeData = sortedMonths.map(month => {
      cumulative += monthlyMap[month]
      return { month, messages: cumulative }
    })
    return cumulativeData
  }
}

export async function getTopUsers(selectedMonth?: string) {
  let query = supabase.from("messages").select("user_id, created_at")
  if (selectedMonth && selectedMonth !== "all") {
    const { start, end } = getMonthRange(selectedMonth)
    query = query.gte("created_at", start).lt("created_at", end)
  }
  const { data, error } = await query
  if (error) {
    console.error("Error fetching messages:", error.message)
    return
  }
  const userCounts: Record<string, number> = {}
  data?.forEach(row => {
    const user = row.user_id || "Unknown"
    userCounts[user] = (userCounts[user] || 0) + 1
  })
  const usersArray = Object.entries(userCounts)
    .map(([user, count], index) => ({
      name: `User ${index + 1}`,
      value: count
    }))
    .sort((a, b) => b.value - a.value)
  const topUsers = usersArray.slice(0, 5)
  const othersTotal = usersArray
    .slice(5)
    .reduce((sum, entry) => sum + entry.value, 0)
  if (othersTotal > 0) {
    topUsers.push({ name: "Others", value: othersTotal })
  }
  return topUsers
}
