import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
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
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChatbotUIContext } from "@/context/context"
import { updateFolder } from "@/db/folders"
import { Tables } from "@/supabase/types"
import { IconEdit } from "@tabler/icons-react"
import { FC, useContext, useRef, useState } from "react"

interface UpdateFolderProps {
  folder: Tables<"folders">
}

export const UpdateFolder: FC<UpdateFolderProps> = ({ folder }) => {
  const { profile, setFolders } = useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [showFolderDialog, setShowFolderDialog] = useState(false)
  const [name, setName] = useState(folder.name)
  const [isPublic, setIsPublic] = useState(folder.public)

  const handleUpdateFolder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const updatedFolder = await updateFolder(folder.id, {
      public: isPublic,
      name
    })
    setFolders(prevState =>
      prevState.map(c => (c.id === folder.id ? updatedFolder : c))
    )

    setShowFolderDialog(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      buttonRef.current?.click()
    }
  }

  return (
    <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
      <DialogTrigger asChild>
        <IconEdit className="hover:opacity-50" size={18} />
      </DialogTrigger>

      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <Label>Name</Label>

          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        {profile?.roles === "superadmin" && (
          <div className="my-3 flex items-center space-x-2">
            <Label>Private</Label>
            <AlertDialog>
              <AlertDialogTrigger>
                <Switch checked={isPublic} id="public" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to change the visibility of this
                    folder to {isPublic ? "private" : "public"}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Switching to {isPublic ? "private" : "public"} will make the
                    folder accessible to
                    {isPublic ? " no-one" : " anyone"}, while setting it to{" "}
                    {!isPublic ? "private" : "public"} will{" "}
                    {isPublic
                      ? "make it available for everyone"
                      : "restrict access to only you"}
                    . This change can be undone at any time.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => setIsPublic(prev => !prev)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Label htmlFor="public">Public</Label>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowFolderDialog(false)}>
            Cancel
          </Button>

          <Button ref={buttonRef} onClick={handleUpdateFolder}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
