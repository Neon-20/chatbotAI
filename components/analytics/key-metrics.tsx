import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "@/supabase/types"
import { createClient } from "@supabase/supabase-js"
import { MessageSquare, Users, BarChart2, TrendingUp } from "lucide-react"

export async function KeyMetrics() {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  // --- 1. Total Users ---
  const { data: totalUsersData, error: totalUsersError } =
    await supabaseAdmin.auth.admin.listUsers()
  const totalUsers = totalUsersData?.users ? totalUsersData.users.length : 0 // Default to 0 if error
  if (totalUsersError) {
    console.error("Error fetching total users:", totalUsersError.message)
  }

  // --- 2. Total Messages ---
  const { data: messages, error: messagesError } = await supabaseAdmin
    .from("messages")
    .select("*")
  const totalMessages = messages ? messages.length : 0 // Default to 0 if error
  if (messagesError) {
    console.error("Error fetching messages:", messagesError.message)
  }

  // --- 3. Active Users (Last 30 Days) ---
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

  const { data: activeUsersData, error: activeUsersError } = await supabaseAdmin
    .from("messages")
    .select("user_id")
    .gte("created_at", thirtyDaysAgoISO)

  const activeUsers = activeUsersData
    ? new Set(activeUsersData.map(message => message.user_id)).size
    : 0 // Count unique user_ids

  if (activeUsersError) {
    console.error("Error fetching active users:", activeUsersError.message)
  }

  // --- 4. Average Messages Per Active User ---
  const avgMessagesPerUser =
    activeUsers > 0 ? (totalMessages / activeUsers).toFixed(2) : 0 // Avoid division by zero

  // --- 5. Monthly Growth ---
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

  // Count messages in the current month
  const {
    data: currentMonthMessages,
    error: currentMonthError,
    count: currentMonthCount
  } = await supabaseAdmin
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

  // Count messages in the previous month
  const {
    data: previousMonthMessages,
    error: previousMonthError,
    count: previousMonthCount
  } = await supabaseAdmin
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

  // --- Construct Metrics ---
  const metrics = [
    {
      title: "Total Messages",
      value: totalMessages,
      description: "All-time messages sent",
      className: "bg-[#004851] text-white",
      icon: MessageSquare,
      iconColor: "text-white"
    },
    {
      title: "Active Users",
      value: activeUsers,
      description: "Users active in the last 30 days",
      className: "bg-[#ffb81c] text-black",
      icon: Users,
      iconColor: "text-black"
    },
    {
      title: "Avg. Messages/User",
      value: avgMessagesPerUser,
      description: "Messages per active user",
      className: "bg-[#e84e0f] text-white",
      icon: BarChart2,
      iconColor: "text-white"
    },
    {
      title: "Monthly Growth",
      value: monthlyGrowthFormatted,
      description: "Message growth last month",
      className: "bg-white border border-gray-200",
      icon: TrendingUp,
      iconColor: "text-black"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map(metric => (
        <Card
          key={metric.title}
          className={`${metric.className} shadow-sm transition-all hover:shadow-md`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="mb-4 flex items-center gap-4 text-sm font-medium opacity-90">
              <metric.icon className={"size-5 " + metric.iconColor} />
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {metric.value}
            </div>
            <p className="mt-1 text-sm opacity-80">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
