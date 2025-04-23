import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET() {
  const supabase = createClient()
  try {
    // Timeframes for data cleanup
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    // Get non-superadmin user IDs
    const { data: nonSuperadminUsers, error: userError } = await supabase
      .from("profiles")
      .select("user_id")
      .not("roles", "eq", "superadmin")

    if (userError) {
      console.error("Error fetching non-superadmin users:", userError)
      return NextResponse.error()
    }

    const nonSuperadminUserIds = nonSuperadminUsers.map(user => user.user_id)

    // Soft delete chats (set is_hidden to true) for data older than 30 days
    // Only for non-superadmins and chats not in folders
    const { error: softDeleteChatsError } = await supabase
      .from("chats")
      .update({
        is_hidden: true,
        updated_at: new Date().toISOString()
      })
      .lt("created_at", thirtyDaysAgo.toISOString())
      .is("folder_id", null)
      .in("user_id", nonSuperadminUserIds)
      .eq("is_hidden", false)

    if (softDeleteChatsError) {
      console.error("Soft deletion of chats error:", softDeleteChatsError)
      return NextResponse.error()
    }

    // For data older than 60 days, nullify content instead of hard deleting
    const { data: chatsToNullify, error: oldChatsError } = await supabase
      .from("chats")
      .select("id")
      .lt("created_at", sixtyDaysAgo.toISOString())
      .eq("is_hidden", true)
      .in("user_id", nonSuperadminUserIds)
      .is("folder_id", null)

    if (oldChatsError) {
      console.error("Error fetching chats for nullification:", oldChatsError)
      return NextResponse.error()
    }

    if (chatsToNullify && chatsToNullify.length > 0) {
      const chatIds = chatsToNullify.map(chat => chat.id)

      // Nullify message content instead of deleting
      const { error: nullifyMessagesError } = await supabase
        .from("messages")
        .update({ content: "" })
        .in("chat_id", chatIds)

      if (nullifyMessagesError) {
        console.error("Error nullifying messages:", nullifyMessagesError)
        return NextResponse.error()
      }

      // Still need to delete chat_files relationships
      const { error: deleteChatFilesError } = await supabase
        .from("chat_files")
        .delete()
        .in("chat_id", chatIds)

      if (deleteChatFilesError) {
        console.error("Error deleting chat_files:", deleteChatFilesError)
        return NextResponse.error()
      }

      // Nullify chat names instead of deleting chats
      const { error: nullifyChatsError } = await supabase
        .from("chats")
        .update({ name: "" })
        .in("id", chatIds)

      if (nullifyChatsError) {
        console.error("Error nullifying chats:", nullifyChatsError)
        return NextResponse.error()
      }
    }

    // Process files - soft delete first
    const { error: softDeleteFilesError } = await supabase
      .from("files")
      .update({
        updated_at: new Date().toISOString()
      })
      .lt("created_at", thirtyDaysAgo.toISOString())
      .is("folder_id", null)
      .in("user_id", nonSuperadminUserIds)

    if (softDeleteFilesError) {
      console.error("Soft deletion of files error:", softDeleteFilesError)
      return NextResponse.error()
    }

    const { data: filesOlderThan30Days, error: oldFiles30DaysError } =
      await supabase
        .from("files")
        .select("id")
        .lt("created_at", thirtyDaysAgo.toISOString())
        .is("folder_id", null)
        .in("user_id", nonSuperadminUserIds)

    if (oldFiles30DaysError) {
      console.error(
        "Error fetching files older than 30 days:",
        oldFiles30DaysError
      )
      return NextResponse.error()
    }

    // Delete file_workspaces for files older than 30 days
    if (filesOlderThan30Days && filesOlderThan30Days.length > 0) {
      const fileIds30Days = filesOlderThan30Days.map(file => file.id)

      const { error: deleteFileWorkspaces30DaysError } = await supabase
        .from("file_workspaces")
        .delete()
        .in("file_id", fileIds30Days)

      if (deleteFileWorkspaces30DaysError) {
        console.error(
          "Error deleting file_workspaces for 30-day old files:",
          deleteFileWorkspaces30DaysError
        )
        return NextResponse.error()
      }
    }

    const { data: filesToNullify, error: oldFilesError } = await supabase
      .from("files")
      .select("id")
      .lt("created_at", sixtyDaysAgo.toISOString())
      .is("folder_id", null)
      .in("user_id", nonSuperadminUserIds)

    if (oldFilesError) {
      console.error("Error fetching files for nullification:", oldFilesError)
      return NextResponse.error()
    }

    if (filesToNullify && filesToNullify.length > 0) {
      const fileIds = filesToNullify.map(file => file.id)

      // Nullify file_items content instead of deleting
      const { error: nullifyFileItemsError } = await supabase
        .from("file_items")
        .update({ content: "" })
        .in("file_id", fileIds)

      if (nullifyFileItemsError) {
        console.error("Error nullifying file items:", nullifyFileItemsError)
        return NextResponse.error()
      }

      const { error: deleteFileWorkspacesError } = await supabase
        .from("file_workspaces")
        .delete()
        .in("file_id", fileIds)

      if (deleteFileWorkspacesError) {
        console.error(
          "Error deleting file workspaces for 60-day old files:",
          deleteFileWorkspacesError
        )
        return NextResponse.error()
      }

      // Nullify file names instead of deleting files
      const { error: nullifyFilesError } = await supabase
        .from("files")
        .update({ name: "" })
        .in("id", fileIds)

      if (nullifyFilesError) {
        console.error("Error nullifying files:", nullifyFilesError)
        return NextResponse.error()
      }
    }

    return NextResponse.json({
      success: true,
      message: "Auto-delete job completed successfully."
    })
  } catch (err: any) {
    console.error("Auto-delete job failed:", err)
    return NextResponse.error()
  }
}
