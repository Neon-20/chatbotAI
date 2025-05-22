import { ChatbotUIContext } from "@/context/context"
import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconRepeat,
  IconThumbUp,
  IconThumbDown,
  IconBookmark,
  IconBookmarkFilled
} from "@tabler/icons-react"
import { FC, useContext, useEffect, useState } from "react"
import { WithTooltip } from "../ui/with-tooltip"
import { toast } from "sonner"

export const MESSAGE_ICON_SIZE = 18

interface MessageActionsProps {
  isAssistant: boolean
  isLast: boolean
  isEditing: boolean
  isHovering: boolean
  onCopy: () => void
  onEdit: () => void
  onRegenerate: () => void
}

export const MessageActions: FC<MessageActionsProps> = ({
  isAssistant,
  isLast,
  isEditing,
  isHovering,
  onCopy,
  onEdit,
  onRegenerate
}) => {
  const { isGenerating } = useContext(ChatbotUIContext)

  const [showCheckmark, setShowCheckmark] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleCopy = () => {
    onCopy()
    setShowCheckmark(true)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
    toast.success(isLiked ? "Like removed" : "Message liked!")
    // TODO: Save to database
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
    toast.success(isDisliked ? "Dislike removed" : "Message disliked")
    // TODO: Save to database
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? "Bookmark removed" : "Message bookmarked!")
    // TODO: Save to database
  }

  const handleForkChat = async () => {}

  useEffect(() => {
    if (showCheckmark) {
      const timer = setTimeout(() => {
        setShowCheckmark(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showCheckmark])

  return (isLast && isGenerating) || isEditing ? null : (
    <div className="text-muted-foreground flex items-center space-x-2">
      {/* {((isAssistant && isHovering) || isLast) && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Fork Chat</div>}
          trigger={
            <IconGitFork
              className="cursor-pointer hover:opacity-50"
              size={MESSAGE_ICON_SIZE}
              onClick={handleForkChat}
            />
          }
        />
      )} */}

      {!isAssistant && isHovering && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Edit</div>}
          trigger={
            <IconEdit
              className="cursor-pointer hover:opacity-50"
              size={MESSAGE_ICON_SIZE}
              onClick={onEdit}
            />
          }
        />
      )}

      {(isHovering || isLast) && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Copy</div>}
          trigger={
            showCheckmark ? (
              <IconCheck size={MESSAGE_ICON_SIZE} />
            ) : (
              <IconCopy
                className="cursor-pointer hover:opacity-50"
                size={MESSAGE_ICON_SIZE}
                onClick={handleCopy}
              />
            )
          }
        />
      )}

      {isLast && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Regenerate</div>}
          trigger={
            <IconRepeat
              className="cursor-pointer hover:opacity-50"
              size={MESSAGE_ICON_SIZE}
              onClick={onRegenerate}
            />
          }
        />
      )}

      {/* Like Button - Only for assistant messages */}
      {isAssistant && (isHovering || isLast) && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>{isLiked ? "Unlike" : "Like"}</div>}
          trigger={
            <IconThumbUp
              className={`cursor-pointer hover:opacity-50 ${isLiked ? "text-green-500" : ""}`}
              size={MESSAGE_ICON_SIZE}
              onClick={handleLike}
            />
          }
        />
      )}

      {/* Dislike Button - Only for assistant messages */}
      {isAssistant && (isHovering || isLast) && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>{isDisliked ? "Remove dislike" : "Dislike"}</div>}
          trigger={
            <IconThumbDown
              className={`cursor-pointer hover:opacity-50 ${isDisliked ? "text-red-500" : ""}`}
              size={MESSAGE_ICON_SIZE}
              onClick={handleDislike}
            />
          }
        />
      )}

      {/* Bookmark Button */}
      {(isHovering || isLast) && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>{isBookmarked ? "Remove bookmark" : "Bookmark"}</div>}
          trigger={
            isBookmarked ? (
              <IconBookmarkFilled
                className="cursor-pointer text-yellow-500 hover:opacity-50"
                size={MESSAGE_ICON_SIZE}
                onClick={handleBookmark}
              />
            ) : (
              <IconBookmark
                className="cursor-pointer hover:opacity-50"
                size={MESSAGE_ICON_SIZE}
                onClick={handleBookmark}
              />
            )
          }
        />
      )}

      {/* {1 > 0 && isAssistant && <MessageReplies />} */}
    </div>
  )
}
