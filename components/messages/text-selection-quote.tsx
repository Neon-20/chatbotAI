import { IconQuote } from "@tabler/icons-react"
import { FC, useContext } from "react"
import { WithTooltip } from "../ui/with-tooltip"
import { ChatbotUIContext } from "@/context/context"
import { MESSAGE_ICON_SIZE } from "./message-actions"

interface TextSelectionQuoteProps {
  selectedText: string
  position: { x: number; y: number }
  onClose: () => void
}

export const TextSelectionQuote: FC<TextSelectionQuoteProps> = ({
  selectedText,
  position,
  onClose
}) => {
  const { userInput, setUserInput } = useContext(ChatbotUIContext)

  const handleQuoteClick = () => {
    // Add the selected text as a quote to the user input
    const quotedText = `> ${selectedText}\n\n`
    setUserInput(prevInput => {
      // If there's already content, add a newline before adding the quote
      if (prevInput.trim()) {
        return `${prevInput}\n\n${quotedText}`
      }
      return quotedText
    })
    onClose()
  }

  return (
    <div
      className="text-selection-quote"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 40}px`
      }}
    >
      <WithTooltip
        delayDuration={500}
        side="top"
        display={<div>Quote selected text</div>}
        trigger={
          <IconQuote
            className="cursor-pointer hover:opacity-50"
            size={MESSAGE_ICON_SIZE}
            onClick={handleQuoteClick}
          />
        }
      />
    </div>
  )
}
