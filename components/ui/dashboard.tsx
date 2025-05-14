"use client"

import { Sidebar } from "@/components/sidebar/sidebar"
import { SidebarSwitcher } from "@/components/sidebar/sidebar-switcher"
import { Button } from "@/components/ui/button"
import { Tabs } from "@/components/ui/tabs"
import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import { ContentType } from "@/types"
import { IconChevronCompactRight } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useState } from "react"
import { useSelectFileHandler } from "../chat/chat-hooks/use-select-file-handler"
import { CommandK } from "../utility/command-k"
import {
  FileSpreadsheet,
  ImageIcon,
  MessageSquare,
  PlusCircle
} from "lucide-react"
import { toast } from "sonner"

export const SIDEBAR_WIDTH = 350

interface DashboardProps {
  children: React.ReactNode
}

export const Dashboard: FC<DashboardProps> = ({ children }) => {
  useHotkey("s", () => setShowSidebar(prevState => !prevState))

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabValue = searchParams.get("tab") || "chats"

  const { handleSelectDeviceFile, filesToAccept } = useSelectFileHandler()

  const [contentType, setContentType] = useState<ContentType>(
    tabValue as ContentType
  )
  const [showSidebar, setShowSidebar] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  const onFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const droppedFiles = event.dataTransfer.files

    if (droppedFiles.length === 0) {
      toast.error("Please drop one or more valid files.", {
        duration: 2000,
        position: "top-center",
        icon: "🚫"
      })
      setIsDragging(false)
      return
    }

    for (const file of Array.from(droppedFiles)) {
      if (file.type === "application/zip") {
        toast.error(`Zip file "${file.name}" is not supported.`)
        continue // Skip to the next file
      }

      if (filesToAccept) {
        const acceptedTypesArray = filesToAccept.split(",").map(t => t.trim())
        let isFileTypeSupported = false
        for (const acceptedType of acceptedTypesArray) {
          if (acceptedType.endsWith("/*")) {
            const baseType = acceptedType.slice(0, -2)
            if (file.type.startsWith(baseType + "/")) {
              isFileTypeSupported = true
              break
            }
          } else {
            if (file.type === acceptedType) {
              isFileTypeSupported = true
              break
            }
          }
        }

        if (isFileTypeSupported) {
          handleSelectDeviceFile(file) // Process this valid file
        } else {
          toast.error(
            `File "${file.name}" has an unsupported type (${file.type}).`
          )
        }
      } else {
        toast.error(
          "File acceptance criteria not available. Cannot process files."
        )
        break // Stop processing further files if criteria is missing
      }
    }
    setIsDragging(false)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleToggleSidebar = () => {
    setShowSidebar(prevState => !prevState)
    localStorage.setItem("showSidebar", String(!showSidebar))
  }

  return (
    <div className="flex size-full">
      <CommandK />

      <div
        className={cn(
          "duration-200 dark:border-none " + (showSidebar ? "border-r-2" : "")
        )}
        style={{
          // Sidebar
          minWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          maxWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          width: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px"
        }}
      >
        {showSidebar && (
          <Tabs
            className="flex h-full"
            value={contentType}
            onValueChange={tabValue => {
              setContentType(tabValue as ContentType)
              router.replace(`${pathname}?tab=${tabValue}`)
            }}
          >
            <SidebarSwitcher onContentTypeChange={setContentType} />

            <Sidebar contentType={contentType} showSidebar={showSidebar} />
          </Tabs>
        )}
      </div>

      <div
        className="bg-muted/50 relative flex w-screen min-w-[90%] grow flex-col sm:min-w-fit"
        onDrop={onFileDrop}
        onDragOver={onDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {isDragging ? (
          <div className="flex h-screen flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-8 text-blue-500" />
              <ImageIcon className="size-8 text-blue-500" />
              <FileSpreadsheet className="size-8 text-blue-500" />
            </div>
            <div className="text-xl font-medium">Add Your Documents</div>
            <p className="text-bold t">
              Drop any file here to include it in your chat!
            </p>
          </div>
        ) : (
          children
        )}

        <Button
          className={cn(
            "absolute left-[4px] top-[50%] z-10 size-[32px] cursor-pointer"
          )}
          style={{
            // marginLeft: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
            transform: showSidebar ? "rotate(180deg)" : "rotate(0deg)"
          }}
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
        >
          <IconChevronCompactRight size={24} />
        </Button>
      </div>
    </div>
  )
}
