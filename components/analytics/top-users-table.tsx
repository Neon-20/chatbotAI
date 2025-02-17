"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function TopUsersTable() {
  const [topUsers, setTopUsers] = useState<
    Array<{ id: string; messages: number }>
  >([])

  useEffect(() => {
    async function fetchData() {
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
      const sortedUsers = Object.entries(userCounts)
        .map(([user, count]) => ({ id: user, messages: count }))
        .sort((a, b) => b.messages - a.messages)
        .slice(0, 5)
      setTopUsers(sortedUsers)
    }
    fetchData()
  }, [])

  return (
    <Card className="shadow-soft transition-all hover:shadow-lg">
      <CardHeader className="bg-ad-teal text-ad-white">
        <CardTitle>Top Users</CardTitle>
        <CardDescription className="text-ad-gray-200">
          Users with the most messages sent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">User ID</TableHead>
              <TableHead className="text-right font-bold">
                Messages Sent
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topUsers.map((user, index) => (
              <TableRow
                key={user.id}
                className={index % 2 === 0 ? "bg-ad-gray-100" : ""}
              >
                <TableCell className="font-medium">
                  {user.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="text-right">{user.messages}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
