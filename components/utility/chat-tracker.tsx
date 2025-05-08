"use client"

import { useFaro } from "./faro-provider"
import { useEffect, useRef } from "react"
import { ChatMessage } from "@/types"

export function ChatTracker({
  messages,
  userId,
  chatId
}: {
  messages: ChatMessage[]
  userId: string
  chatId: string
}) {
  const { logEvent } = useFaro()
  const prevMessagesLengthRef = useRef(messages.length)

  useEffect(() => {
    // Only track when a new message is added
    if (messages.length > prevMessagesLengthRef.current) {
      const latestMessage = messages[messages.length - 1]

      logEvent("chat_message_sent", {
        userId,
        chatId,
        messageRole: latestMessage.message.role,
        messageLength: latestMessage.message.content.length,
        timestamp: new Date().toISOString()
      })
    }

    prevMessagesLengthRef.current = messages.length
  }, [messages, userId, chatId, logEvent])

  return null
}
