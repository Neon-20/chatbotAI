import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const runtime = "edge"

// Helper function to process arrays in batches
const processBatches = <T>(array: T[], batchSize: number): T[][] => {
  const batches: T[][] = []
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize))
  }
  return batches
}

export async function GET() {
  const supabase = createClient()
  const userBatchSize = 15
  const chatBatchSize = 15
  const fileBatchSize = 15
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

    const userBatches = processBatches(nonSuperadminUserIds, userBatchSize)
    const totalUserBatches = userBatches.length

    console.log(
      `Processing ${nonSuperadminUserIds.length} users in ${totalUserBatches} batches of ${userBatchSize}`
    )

    for (let batchIndex = 0; batchIndex < userBatches.length; batchIndex++) {
      const userIdBatch = userBatches[batchIndex]
      console.log(
        `Processing batch ${batchIndex + 1}/${totalUserBatches} with ${userIdBatch.length} users`
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
          `Soft deletion of chats error for batch ${batchIndex + 1}:`,
          softDeleteChatsError
        )
        return NextResponse.json({
          success: false,
          message: `Error soft deleting chats in batch ${batchIndex + 1}.`
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
          `Error fetching chats for nullification in batch ${batchIndex + 1}:`,
          oldChatsError
        )
        return NextResponse.json({
          success: false,
          message: `Error fetching chats for nullification in batch ${batchIndex + 1}.`
        })
      }

      if (chatsToNullify && chatsToNullify.length > 0) {
        const chatIds = chatsToNullify.map(chat => chat.id)

        // Process chat IDs in batches

        const chatIdBatches = processBatches(chatIds, chatBatchSize)

        for (
          let chatBatchIndex = 0;
          chatBatchIndex < chatIdBatches.length;
          chatBatchIndex++
        ) {
          const currentChatBatch = chatIdBatches[chatBatchIndex]
          console.log(
            `Processing chat batch ${chatBatchIndex + 1}/${chatIdBatches.length} with ${currentChatBatch.length} chats`
          )

          // Nullify message content instead of deleting
          const { error: nullifyMessagesError } = await supabase
            .from("messages")
            .update({ content: "" })
            .in("chat_id", currentChatBatch)

          if (nullifyMessagesError) {
            console.error(
              `Error nullifying messages in user batch ${batchIndex + 1}, chat batch ${chatBatchIndex + 1}:`,
              nullifyMessagesError
            )
            return NextResponse.json({
              success: false,
              message: `Error nullifying messages in user batch ${batchIndex + 1}, chat batch ${chatBatchIndex + 1}.`
            })
          }

          // Still need to delete chat_files relationships
          const { error: deleteChatFilesError } = await supabase
            .from("chat_files")
            .delete()
            .in("chat_id", currentChatBatch)

          if (deleteChatFilesError) {
            console.error(
              `Error deleting chat_files in user batch ${batchIndex + 1}, chat batch ${chatBatchIndex + 1}:`,
              deleteChatFilesError
            )
            return NextResponse.json({
              success: false,
              message: `Error deleting chat_files in user batch ${batchIndex + 1}, chat batch ${chatBatchIndex + 1}.`
            })
          }

          // Nullify chat names instead of deleting chats
          const { error: nullifyChatsError } = await supabase
            .from("chats")
            .update({ name: "" })
            .in("id", currentChatBatch)

          if (nullifyChatsError) {
            console.error(
              `Error nullifying chats in user batch ${batchIndex + 1}, chat batch ${chatBatchIndex + 1}:`,
              nullifyChatsError
            )
            return NextResponse.json({
              success: false,
              message: `Error nullifying chats in user batch ${batchIndex + 1}, chat batch ${chatBatchIndex + 1}.`
            })
          }
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
          `Soft deletion of files error in batch ${batchIndex + 1}:`,
          softDeleteFilesError
        )
        return NextResponse.json({
          success: false,
          message: `Error soft deleting files in batch ${batchIndex + 1}.`
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
          `Error fetching files older than 30 days in batch ${batchIndex + 1}:`,
          oldFiles30DaysError
        )
        return NextResponse.json({
          success: false,
          message: `Error fetching files older than 30 days in batch ${batchIndex + 1}.`
        })
      }

      // Delete file_workspaces for files older than 30 days
      if (filesOlderThan30Days && filesOlderThan30Days.length > 0) {
        const fileIds30Days = filesOlderThan30Days.map(file => file.id)

        // Process 30-day files in batches

        const fileIds30DayBatches = processBatches(fileIds30Days, fileBatchSize)

        for (
          let fileBatchIndex = 0;
          fileBatchIndex < fileIds30DayBatches.length;
          fileBatchIndex++
        ) {
          const currentFileBatch = fileIds30DayBatches[fileBatchIndex]
          console.log(
            `Processing 30-day files batch ${fileBatchIndex + 1}/${fileIds30DayBatches.length} with ${currentFileBatch.length} files`
          )

          const { error: deleteFileWorkspaces30DaysError } = await supabase
            .from("file_workspaces")
            .delete()
            .in("file_id", currentFileBatch)

          if (deleteFileWorkspaces30DaysError) {
            console.error(
              `Error deleting file_workspaces for 30-day old files in user batch ${batchIndex + 1}, file batch ${fileBatchIndex + 1}:`,
              deleteFileWorkspaces30DaysError
            )
            return NextResponse.json({
              success: false,
              message: `Error deleting file_workspaces for 30-day old files in user batch ${batchIndex + 1}, file batch ${fileBatchIndex + 1}.`
            })
          }
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
          `Error fetching files for nullification in batch ${batchIndex + 1}:`,
          oldFilesError
        )
        return NextResponse.json({
          success: false,
          message: `Error fetching files for nullification in batch ${batchIndex + 1}.`
        })
      }

      if (filesToNullify && filesToNullify.length > 0) {
        const fileIds = filesToNullify.map(file => file.id)

        // Process 60-day files in batches

        const fileIdBatches = processBatches(fileIds, fileBatchSize)

        for (
          let fileBatchIndex = 0;
          fileBatchIndex < fileIdBatches.length;
          fileBatchIndex++
        ) {
          const currentFileBatch = fileIdBatches[fileBatchIndex]
          console.log(
            `Processing 60-day files batch ${fileBatchIndex + 1}/${fileIdBatches.length} with ${currentFileBatch.length} files`
          )

          // Nullify file_items content instead of deleting
          const { error: nullifyFileItemsError } = await supabase
            .from("file_items")
            .update({ content: "" })
            .in("file_id", currentFileBatch)

          if (nullifyFileItemsError) {
            console.error(
              `Error nullifying file items in user batch ${batchIndex + 1}, file batch ${fileBatchIndex + 1}:`,
              nullifyFileItemsError
            )
            return NextResponse.json({
              success: false,
              message: `Error nullifying file items in user batch ${batchIndex + 1}, file batch ${fileBatchIndex + 1}.`
            })
          }

          const { error: deleteFileWorkspacesError } = await supabase
            .from("file_workspaces")
            .delete()
            .in("file_id", currentFileBatch)

          if (deleteFileWorkspacesError) {
            console.error(
              `Error deleting file workspaces for 60-day old files in user batch ${batchIndex + 1}, file batch ${fileBatchIndex + 1}:`,
              deleteFileWorkspacesError
            )
            return NextResponse.json({
              success: false,
              message: `Error deleting file workspaces for 60-day old files in user batch ${batchIndex + 1}, file batch ${fileBatchIndex + 1}.`
            })
          }

          // Nullify file names instead of deleting files
          const { error: nullifyFilesError } = await supabase
            .from("files")
            .update({ name: "" })
            .in("id", currentFileBatch)

          if (nullifyFilesError) {
            console.error(
              `Error nullifying files in user batch ${batchIndex + 1}, file batch ${fileBatchIndex + 1}:`,
              nullifyFilesError
            )
            return NextResponse.json({
              success: false,
              message: `Error nullifying files in user batch ${batchIndex + 1}, file batch ${fileBatchIndex + 1}.`
            })
          }
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
