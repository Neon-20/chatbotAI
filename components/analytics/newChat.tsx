"use client"

import { IconArrowLeft } from "@tabler/icons-react"
import { useChatHandler } from "../chat/chat-hooks/use-chat-handler"
import { Button } from "../ui/button"

const NewChat = () => {
  const { handleNewChat } = useChatHandler()
  return (
    <Button
      onClick={handleNewChat}
      className="hover:text-ad-gold text-sm transition-colors"
    >
      <IconArrowLeft className="mr-2" size={20} />
      Go Back to Chat
    </Button>
  )
}

export default NewChat
