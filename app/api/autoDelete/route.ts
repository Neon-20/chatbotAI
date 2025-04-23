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
      return NextResponse.json({
        success: false,
        message: "Error fetching non-superadmin users."
      })
    }

    const nonSuperadminUserIds = nonSuperadminUsers.map(user => user.user_id)

    const batchSize = 1
    const totalBatches = Math.ceil(nonSuperadminUserIds.length / batchSize)

    console.log(
      `Processing ${nonSuperadminUserIds.length} users in ${totalBatches} batches of ${batchSize}`
    )

    for (let i = 0; i < nonSuperadminUserIds.length; i += batchSize) {
      const userIdBatch = nonSuperadminUserIds.slice(i, i + batchSize)
      console.log(
        `Processing batch ${Math.floor(i / batchSize) + 1}/${totalBatches} with ${userIdBatch.length} users`
      )
      const { error: softDeleteChatsError } = await supabase
        .from("chats")
        .update({
          is_hidden: true,
          updated_at: new Date().toISOString()
        })
        .lt("created_at", thirtyDaysAgo.toISOString())
        .is("folder_id", null)
        .in("user_id", userIdBatch)
        .eq("is_hidden", false)

      if (softDeleteChatsError) {
        console.error(
          `Soft deletion of chats error for batch ${Math.floor(i / batchSize) + 1}:`,
          softDeleteChatsError
        )
        return NextResponse.json({
          success: false,
          message: `Error soft deleting chats in batch ${Math.floor(i / batchSize) + 1}.`
        })
      }

      // For data older than 60 days, nullify content instead of hard deleting
      const { data: chatsToNullify, error: oldChatsError } = await supabase
        .from("chats")
        .select("id")
        .lt("created_at", sixtyDaysAgo.toISOString())
        .eq("is_hidden", true)
        .in("user_id", userIdBatch)
        .is("folder_id", null)

      if (oldChatsError) {
        console.error(
          `Error fetching chats for nullification in batch ${Math.floor(i / batchSize) + 1}:`,
          oldChatsError
        )
        return NextResponse.json({
          success: false,
          message: `Error fetching chats for nullification in batch ${Math.floor(i / batchSize) + 1}.`
        })
      }

      if (chatsToNullify && chatsToNullify.length > 0) {
        const chatIds = chatsToNullify.map(chat => chat.id)

        // Nullify message content instead of deleting
        const { error: nullifyMessagesError } = await supabase
          .from("messages")
          .update({ content: "" })
          .in("chat_id", chatIds)

        if (nullifyMessagesError) {
          console.error(
            `Error nullifying messages in batch ${Math.floor(i / batchSize) + 1}:`,
            nullifyMessagesError
          )
          return NextResponse.json({
            success: false,
            message: `Error nullifying messages in batch ${Math.floor(i / batchSize) + 1}.`
          })
        }

        // Still need to delete chat_files relationships
        const { error: deleteChatFilesError } = await supabase
          .from("chat_files")
          .delete()
          .in("chat_id", chatIds)

        if (deleteChatFilesError) {
          console.error(
            `Error deleting chat_files in batch ${Math.floor(i / batchSize) + 1}:`,
            deleteChatFilesError
          )
          return NextResponse.json({
            success: false,
            message: `Error deleting chat_files in batch ${Math.floor(i / batchSize) + 1}.`
          })
        }

        // Nullify chat names instead of deleting chats
        const { error: nullifyChatsError } = await supabase
          .from("chats")
          .update({ name: "" })
          .in("id", chatIds)

        if (nullifyChatsError) {
          console.error(
            `Error nullifying chats in batch ${Math.floor(i / batchSize) + 1}:`,
            nullifyChatsError
          )
          return NextResponse.json({
            success: false,
            message: `Error nullifying chats in batch ${Math.floor(i / batchSize) + 1}.`
          })
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
        .in("user_id", userIdBatch)

      if (softDeleteFilesError) {
        console.error(
          `Soft deletion of files error in batch ${Math.floor(i / batchSize) + 1}:`,
          softDeleteFilesError
        )
        return NextResponse.json({
          success: false,
          message: `Error soft deleting files in batch ${Math.floor(i / batchSize) + 1}.`
        })
      }

      const { data: filesOlderThan30Days, error: oldFiles30DaysError } =
        await supabase
          .from("files")
          .select("id")
          .lt("created_at", thirtyDaysAgo.toISOString())
          .is("folder_id", null)
          .in("user_id", userIdBatch)

      if (oldFiles30DaysError) {
        console.error(
          `Error fetching files older than 30 days in batch ${Math.floor(i / batchSize) + 1}:`,
          oldFiles30DaysError
        )
        return NextResponse.json({
          success: false,
          message: `Error fetching files older than 30 days in batch ${Math.floor(i / batchSize) + 1}.`
        })
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
            `Error deleting file_workspaces for 30-day old files in batch ${Math.floor(i / batchSize) + 1}:`,
            deleteFileWorkspaces30DaysError
          )
          return NextResponse.json({
            success: false,
            message: `Error deleting file_workspaces for 30-day old files in batch ${Math.floor(i / batchSize) + 1}.`
          })
        }
      }

      const { data: filesToNullify, error: oldFilesError } = await supabase
        .from("files")
        .select("id")
        .lt("created_at", sixtyDaysAgo.toISOString())
        .is("folder_id", null)
        .in("user_id", userIdBatch)

      if (oldFilesError) {
        console.error(
          `Error fetching files for nullification in batch ${Math.floor(i / batchSize) + 1}:`,
          oldFilesError
        )
        return NextResponse.json({
          success: false,
          message: `Error fetching files for nullification in batch ${Math.floor(i / batchSize) + 1}.`
        })
      }

      if (filesToNullify && filesToNullify.length > 0) {
        const fileIds = filesToNullify.map(file => file.id)

        // Nullify file_items content instead of deleting
        const { error: nullifyFileItemsError } = await supabase
          .from("file_items")
          .update({ content: "" })
          .in("file_id", fileIds)

        if (nullifyFileItemsError) {
          console.error(
            `Error nullifying file items in batch ${Math.floor(i / batchSize) + 1}:`,
            nullifyFileItemsError
          )
          return NextResponse.json({
            success: false,
            message: `Error nullifying file items in batch ${Math.floor(i / batchSize) + 1}.`
          })
        }

        const { error: deleteFileWorkspacesError } = await supabase
          .from("file_workspaces")
          .delete()
          .in("file_id", fileIds)

        if (deleteFileWorkspacesError) {
          console.error(
            `Error deleting file workspaces for 60-day old files in batch ${Math.floor(i / batchSize) + 1}:`,
            deleteFileWorkspacesError
          )
          return NextResponse.json({
            success: false,
            message: `Error deleting file workspaces for 60-day old files in batch ${Math.floor(i / batchSize) + 1}.`
          })
        }

        // Nullify file names instead of deleting files
        const { error: nullifyFilesError } = await supabase
          .from("files")
          .update({ name: "" })
          .in("id", fileIds)

        if (nullifyFilesError) {
          console.error(
            `Error nullifying files in batch ${Math.floor(i / batchSize) + 1}:`,
            nullifyFilesError
          )
          return NextResponse.json({
            success: false,
            message: `Error nullifying files in batch ${Math.floor(i / batchSize) + 1}.`
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Auto-delete job completed successfully."
    })
  } catch (err: any) {
    console.error("Auto-delete job failed:", err)
    return NextResponse.json({
      success: false,
      message: "An error occurred during the auto-delete job.",
      error: err.message
    })
  }
}
