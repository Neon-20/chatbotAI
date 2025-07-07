import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { ChatbotUIContext } from "@/context/context"
import { deleteWorkspace, getHomeWorkspaceByUserId } from "@/db/workspaces"
import { Tables } from "@/supabase/types"
import { FC, useContext, useRef, useState } from "react"
import { Input } from "../ui/input"
import { toast } from "sonner"
import { IconLoader2 } from "@tabler/icons-react"

interface DeleteWorkspaceProps {
  workspace: Tables<"workspaces">
  onDelete: () => void
}

export const DeleteWorkspace: FC<DeleteWorkspaceProps> = ({
  workspace,
  onDelete
}) => {
  const { setWorkspaces, setSelectedWorkspace, profile } =
    useContext(ChatbotUIContext)
  const { handleNewChat } = useChatHandler()

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [showWorkspaceDialog, setShowWorkspaceDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [name, setName] = useState("")

  const handleDeleteWorkspace = async () => {
    if (!profile) {
      toast.error("User profile not found. Please refresh and try again.")
      return
    }

    setIsDeleting(true)

    try {
      // Step 1: Delete the workspace from database
      await deleteWorkspace(workspace.id)

      // Step 2: Get the home workspace ID for the user
      let homeWorkspaceId: string
      try {
        homeWorkspaceId = await getHomeWorkspaceByUserId(profile.user_id)
      } catch (error) {
        console.error("Failed to get home workspace:", error)
        toast.error("Failed to find home workspace. Redirecting to login.")
        window.location.href = "/login"
        return
      }

      // Step 3: Update local state
      setWorkspaces(prevWorkspaces => {
        const filteredWorkspaces = prevWorkspaces.filter(
          w => w.id !== workspace.id
        )

        const homeWorkspace = filteredWorkspaces.find(
          w => w.id === homeWorkspaceId
        )

        if (homeWorkspace) {
          setSelectedWorkspace(homeWorkspace)
        } else {
          // Fallback: if home workspace not in local state, we'll still redirect
          console.warn(
            "Home workspace not found in local state, but continuing with redirect"
          )
        }

        return filteredWorkspaces
      })

      // Step 4: Clean up UI state
      setShowWorkspaceDialog(false)
      onDelete()

      // Step 5: Reset chat state
      handleNewChat()

      // Step 6: Show success message and redirect
      toast.success("Workspace deleted successfully")

      // Small delay to ensure state updates complete before navigation
      setTimeout(() => {
        window.location.href = `/${homeWorkspaceId}/chat`
      }, 100)
    } catch (error) {
      console.error("Failed to delete workspace:", error)
      toast.error("Failed to delete workspace. Please try again.")
      setIsDeleting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      buttonRef.current?.click()
    }
  }

  return (
    <Dialog
      open={showWorkspaceDialog}
      onOpenChange={open => {
        // Prevent closing dialog during deletion
        if (!isDeleting) {
          setShowWorkspaceDialog(open)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>

      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Delete {workspace.name}</DialogTitle>

          <DialogDescription className="space-y-1">
            WARNING: Deleting a workspace will delete all of its data.
          </DialogDescription>
        </DialogHeader>

        <Input
          className="mt-4"
          placeholder="Type the name of this workspace to confirm"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setShowWorkspaceDialog(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            ref={buttonRef}
            variant="destructive"
            onClick={handleDeleteWorkspace}
            disabled={name !== workspace.name || isDeleting}
          >
            {isDeleting ? (
              <>
                <IconLoader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
