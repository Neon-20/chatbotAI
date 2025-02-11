import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { ContentType } from "@/types"
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react"
import { FC, useContext, useRef, useState } from "react"
import { DeleteFolder } from "./delete-folder"
import { UpdateFolder } from "./update-folder"
import { ChatbotUIContext } from "@/context/context"
import { PlusIcon } from "lucide-react"
import { CreatePrompt } from "../prompts/create-prompt"

interface FolderProps {
  folder: Tables<"folders">
  contentType: ContentType
  children: React.ReactNode
  onUpdateFolder: (itemId: string, folderId: string | null) => void
}

export const Folder: FC<FolderProps> = ({
  folder,
  contentType,
  children,
  onUpdateFolder
}) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const { profile } = useContext(ChatbotUIContext)

  const [isDragOver, setIsDragOver] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false)

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    setIsDragOver(false)
    const itemId = e.dataTransfer.getData("text/plain")
    onUpdateFolder(itemId, folder.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
      itemRef.current?.click()
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsExpanded(!isExpanded)
  }

  const handleCreatePrompt = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsCreatingPrompt(true)
  }

  return (
    <div
      ref={itemRef}
      id="folder"
      className={
        folder.public
          ? "text-blue-500"
          : "" + cn("rounded focus:outline-none", isDragOver && "bg-accent")
      }
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        tabIndex={0}
        className={cn(
          "hover:bg-accent focus:bg-accent flex w-full cursor-pointer items-center justify-between rounded p-2 hover:opacity-50 focus:outline-none"
        )}
        onClick={handleClick}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-2">
            {isExpanded ? (
              <IconChevronDown stroke={3} />
            ) : (
              <IconChevronRight stroke={3} />
            )}

            <div>{folder.name}</div>
          </div>

          {isHovering &&
            (profile?.roles == "superadmin" ||
              folder.user_id == profile?.user_id) && (
              <div
                onClick={e => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
                className="ml-2 flex space-x-2"
              >
                <PlusIcon
                  className="size-5 hover:opacity-50"
                  onClick={handleCreatePrompt}
                />
                <UpdateFolder folder={folder} />
                <DeleteFolder folder={folder} contentType={contentType} />
              </div>
            )}
        </div>
      </div>

      {isExpanded && (
        <div className="ml-5 mt-2 space-y-2 border-l-2 pl-4">{children}</div>
      )}

      {isCreatingPrompt && contentType == "prompts" && (
        <CreatePrompt
          isOpen={isCreatingPrompt}
          onOpenChange={isOpen => {
            setIsCreatingPrompt(isOpen)
            if (!isOpen) {
            }
          }}
          folderId={folder.id}
        />
      )}
    </div>
  )
}
