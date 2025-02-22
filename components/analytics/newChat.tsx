"use client"

import { IconArrowLeft } from "@tabler/icons-react"
import { useChatHandler } from "../chat/chat-hooks/use-chat-handler"
import { Button } from "../ui/button"

const NewChat = () => {
  const { handleNewChat } = useChatHandler()
  return (
    <Button
      onClick={handleNewChat}
      variant={"ghost"}
      className="text-sm transition-colors hover:bg-transparent hover:text-white/90"
    >
      <IconArrowLeft className="mr-2" size={20} />
      Go Back to Chat
    </Button>
  )
}

export default NewChat
