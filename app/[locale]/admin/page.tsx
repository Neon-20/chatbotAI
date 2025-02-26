"use client"
import { toast } from "sonner"
import { useContext, useEffect, useState, useMemo } from "react"
import { TablesUpdate } from "@/supabase/types"
import { supabase } from "@/lib/supabase/browser-client"
import { getAllProfiles } from "@/db/profile"
import { ChatbotUIContext } from "@/context/context"
import { ArrowUpDown, Trash2, XIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import NewChat from "@/components/analytics/newChat"

type Role = "user" | "developer" | "admin" | "superadmin"

const AdminRolesPage = () => {
  const { profile } = useContext(ChatbotUIContext)
  const [profileList, setProfileList] = useState<TablesUpdate<"profiles">[]>([])
  const [inputValue, setInputValue] = useState("")
  const [sortOrder, setSortOrder] = useState<{
    created_at: "asc" | "desc"
    updated_at: "asc" | "desc"
  }>({ created_at: "asc", updated_at: "asc" })
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at">(
    "created_at"
  )
  const [loading, setLoading] = useState(false)
  const [totalSuperAdmins, setTotalSuperAdmins] = useState(0)
  const [totalAdmins, setTotalAdmins] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true)
      let profiles = await getAllProfiles()
      profiles.forEach(profile => {
        if (!profile.updated_at) {
          profile.updated_at = profile.created_at
        }
      })
      setProfileList(profiles)
      setLoading(false)
      setTotalSuperAdmins(
        profiles.filter(user => user.roles === "superadmin").length
      )
      setTotalAdmins(profiles.filter(user => user.roles === "admin").length)
      setTotalUsers(profiles.filter(user => user.roles === "user").length)
    }
    fetchProfiles()
  }, [])

  const filteredProfileList = useMemo(() => {
    const filtered = profileList.filter(
      user =>
        user.username?.toLowerCase().includes(inputValue.toLowerCase()) ||
        user.display_name?.toLowerCase().includes(inputValue.toLowerCase())
    )
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a[sortBy] ?? "").getTime()
      const dateB = new Date(b[sortBy] ?? "").getTime()
      return sortOrder[sortBy] === "asc" ? dateA - dateB : dateB - dateA
    })
    return sorted
  }, [inputValue, profileList, sortOrder, sortBy])

  const handleRoleChange = async (username: string, newRole: Role) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ roles: newRole })
        .eq("username", username)

      if (error) throw error

      setProfileList(
        profileList.map(user =>
          user.username === username ? { ...user, roles: newRole } : user
        )
      )
      console.log("Role updated successfully")
      toast.success("Role updated successfully")
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("Error updating role")
    }
  }

  const handleDeleteUser = async (userId: string | undefined) => {
    try {
      if (!userId) throw "User ID not found"

      const { data, error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId)
      const { error: err } = await supabase
        .from("users")
        .delete()
        .eq("id", userId)

      if (error) throw error

      setProfileList(profileList.filter(user => user.id !== userId))
      toast.success("User removed successfully")
    } catch (error) {
      console.error("Error removing user:", error)
      toast.error("Error removing user")
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return undefined
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  const toggleSortOrder = (column: "created_at" | "updated_at") => {
    setSortBy(column)
    setSortOrder(prev => ({
      ...prev,
      [column]: prev[column] === "asc" ? "desc" : "asc"
    }))
  }

  return (
    <div className="min-w-fit p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="mb-4 text-2xl font-bold">Admin Role Management</h1>
        <NewChat />
      </div>
      <div className="max-h-[95vh] overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <>
            <div className="relative">
              <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Search users..."
                className="my-2 pr-8"
              />
              {inputValue && (
                <XIcon
                  className="absolute right-2 top-1/2 size-4 -translate-y-1/2 cursor-pointer"
                  onClick={() => setInputValue("")}
                />
              )}
            </div>
            <Table>
              <TableHeader>
                {/* <TableCell colSpan={5} className="text-center text-red-400">
                  Total SuperAdmins: {totalSuperAdmins} | Total Admins:{" "}
                  {totalAdmins} | Total Users: {totalUsers}
                </TableCell> */}
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>
                    <Button
                      className="gap-3"
                      variant="ghost"
                      onClick={() => toggleSortOrder("created_at")}
                    >
                      Date Joined <ArrowUpDown size={18} />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="gap-3"
                      onClick={() => toggleSortOrder("updated_at")}
                    >
                      Last Login <ArrowUpDown size={18} />
                    </Button>
                  </TableHead>
                  {profile?.roles === "superadmin" && (
                    <TableHead>Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfileList.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Select
                        value={user.roles}
                        onValueChange={(value: Role) =>
                          handleRoleChange(user.username!, value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User 👨🏻</SelectItem>
                          <SelectItem value="developer">
                            Developer 👨🏻‍💻
                          </SelectItem>
                          <SelectItem value="admin">Admin 👑</SelectItem>
                          <SelectItem
                            value="superadmin"
                            disabled={profile?.roles !== "superadmin"}
                          >
                            Super Admin 👑👑
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at ?? "")}</TableCell>
                    <TableCell>{formatDate(user.updated_at ?? "")}</TableCell>
                    {profile?.roles === "superadmin" && (
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this user?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                The profile will be permanently removed and
                                cannot be recovered.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminRolesPage
