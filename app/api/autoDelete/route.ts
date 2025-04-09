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

    // Hard delete messages for soft-deleted chats older than 60 days
    const { data: chatsToHardDelete, error: oldChatsError } = await supabase
      .from("chats")
      .select("id")
      .lt("created_at", sixtyDaysAgo.toISOString())
      .eq("is_hidden", true)
      .in("user_id", nonSuperadminUserIds)
      .is("folder_id", null)

    if (oldChatsError) {
      console.error("Error fetching chats for hard deletion:", oldChatsError)
      return NextResponse.error()
    }

    if (chatsToHardDelete && chatsToHardDelete.length > 0) {
      const chatIds = chatsToHardDelete.map(chat => chat.id)

      // Delete related messages first (foreign key constraint)
      const { error: deleteMessagesError } = await supabase
        .from("messages")
        .delete()
        .in("chat_id", chatIds)

      if (deleteMessagesError) {
        console.error("Error deleting messages:", deleteMessagesError)
        return NextResponse.error()
      }

      // Delete chat_files relationships
      const { error: deleteChatFilesError } = await supabase
        .from("chat_files")
        .delete()
        .in("chat_id", chatIds)

      if (deleteChatFilesError) {
        console.error("Error deleting chat_files:", deleteChatFilesError)
        return NextResponse.error()
      }

      // Finally delete the chats
      const { error: deleteChatsError } = await supabase
        .from("chats")
        .delete()
        .in("id", chatIds)

      if (deleteChatsError) {
        console.error("Error during hard deletion of chats:", deleteChatsError)
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

    const { data: filesToDelete, error: oldFilesError } = await supabase
      .from("files")
      .select("id")
      .lt("created_at", sixtyDaysAgo.toISOString())
      .is("folder_id", null)
      .in("user_id", nonSuperadminUserIds)

    if (oldFilesError) {
      console.error("Error fetching files for deletion:", oldFilesError)
      return NextResponse.error()
    }

    if (filesToDelete && filesToDelete.length > 0) {
      const fileIds = filesToDelete.map(file => file.id)

      const { error: deleteFileItemsError } = await supabase
        .from("file_items")
        .delete()
        .in("file_id", fileIds)

      if (deleteFileItemsError) {
        console.error("Error deleting file items:", deleteFileItemsError)
        return NextResponse.error()
      }

      const { error: deleteFileWorkspacesError } = await supabase
        .from("file_workspaces")
        .delete()
        .in("file_id", fileIds)

      if (deleteFileWorkspacesError) {
        console.error(
          "Error deleting file workspaces:",
          deleteFileWorkspacesError
        )
        return NextResponse.error()
      }

      const { error: deleteFilesError } = await supabase
        .from("files")
        .delete()
        .in("id", fileIds)

      if (deleteFilesError) {
        console.error("Error during hard deletion of files:", deleteFilesError)
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
