import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { TextareaAutosize } from "@/components/ui/textarea-autosize"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { ChatbotUIContext } from "@/context/context"
import { suggestionTilesContent } from "@/lib/suggestions/suggestion-tiles-content"
import { Tables } from "@/supabase/types"
import {
  IconBolt,
  IconMail,
  IconLanguage,
  IconFileDescription,
  IconCalendar,
  IconListDetails,
  IconWriting
} from "@tabler/icons-react"

import { useContext, useState } from "react"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { trackTileClick } from "@/db/tile-insights"
import { useParams } from "next/navigation"

function SuggestionTiles() {
  const { setUserInput, chatMessages, profile } = useContext(ChatbotUIContext)
  const { handleSendMessage } = useChatHandler()
  const params = useParams()

  const [showPromptVariables, setShowPromptVariables] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [promptContent, setPromptContent] = useState("")
  const [selectedPrompt, setSelectedPrompt] =
    useState<Tables<"prompts"> | null>(null)

  // Function to get the appropriate icon component based on the icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "FileText":
        return <IconWriting size={16} className="shrink-0 text-white" />
      case "Mail":
        return <IconMail size={16} className="shrink-0 text-white" />
      case "Language":
        return <IconLanguage size={16} className="shrink-0 text-white" />
      case "FileDescription":
        return <IconFileDescription size={16} className="shrink-0 text-white" />
      case "Calendar":
        return <IconCalendar size={16} className="shrink-0 text-white" />
      case "ListDetails":
        return <IconListDetails size={16} className="shrink-0 text-white" />
      default:
        return (
          <IconBolt
            size={16}
            className="shrink-0"
            style={{ color: "#FF7300" }}
          />
        )
    }
  }

  const handlePromptSelection = async (
    suggestionContent: string,
    suggestionName: string,
    tileIndex: number
  ) => {
    // Track tile click analytics
    if (profile?.user_id && params.workspaceid) {
      try {
        await trackTileClick({
          workspace_id: params.workspaceid as string,
          tile_name: suggestionName,
          tile_index: tileIndex,
          user_agent: navigator.userAgent,
          session_id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
        })
      } catch (error) {
        console.error("Error tracking tile click:", error)
        // Don't block the user experience if analytics fail
      }
    }

    const testPrompt: Tables<"prompts"> = {
      id: "test-prompt-id",
      user_id: "test-user",
      name: suggestionName,
      content: suggestionContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sharing: "private",
      public: false,
      folder_id: null
    }

    // Check directly for variables in the content
    const regex = /\{\{.*?\}\}/g
    const matches = suggestionContent.match(regex)

    console.log("Variable matches:", matches)

    if (matches && matches.length > 0) {
      // Found variables, show dialog
      setSelectedPrompt(testPrompt)
      setPromptContent("")
      setShowPromptVariables(true)
    } else {
      // No variables, auto-submit the message
      setUserInput(suggestionContent)
      // Auto-submit the message
      handleSendMessage(suggestionContent, chatMessages, false)
    }
  }

  const handleKeydownPromptVariables = (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (!isTyping && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmitPromptVariables()
    }
  }

  const handleSubmitPromptVariables = () => {
    if (!selectedPrompt || !promptContent.trim()) return

    // Replace all variable placeholders with the user's content
    const regex = /\{\{.*?\}\}/g
    const newPromptContent =
      selectedPrompt.content?.replace(regex, promptContent.trim()) ||
      promptContent

    // Set the user input and auto-submit the message
    setUserInput(newPromptContent)
    handleSendMessage(newPromptContent, chatMessages, false)

    setShowPromptVariables(false)
    setPromptContent("")
    setSelectedPrompt(null)
  }

  const handleCancelPromptVariables = () => {
    setShowPromptVariables(false)
    setPromptContent("")
    setSelectedPrompt(null)
  }

  return (
    <div>
      <div className="w-full">
        <div
          className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg"
          style={{ boxSizing: "border-box" }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(90deg, #e84315, #e84315, #FF6B00, #e84315, #e84315)",
                backgroundSize: "300% 100%",
                zIndex: 0
              }}
            />
          </div>
          <div className="relative z-10 m-[4px] rounded-xl bg-white/95 p-5 dark:bg-gray-800/95">
            <div className="mb-4 flex flex-col items-center justify-center">
              <h3 className="text-md mb-2 text-center font-medium text-slate-800 dark:text-gray-300">
                What would you like to do today?
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <TooltipProvider delayDuration={300}>
                {suggestionTilesContent.map((suggestion, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className="relative flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black/80 px-3 py-2 text-gray-800 shadow-sm backdrop-blur-md transition-colors hover:bg-black/90 dark:text-gray-200"
                        onClick={() =>
                          handlePromptSelection(
                            suggestion.content,
                            suggestion.name,
                            index
                          )
                        }
                      >
                        {/* AlterDomus orange-red border effect */}
                        <div className="absolute inset-0 overflow-hidden rounded-xl p-[2px]">
                          <div
                            className="absolute inset-0 rounded-xl"
                            style={{
                              background:
                                "linear-gradient(90deg, #e84315, #e84315, #FF6B00, #e84315, #e84315)",
                              backgroundSize: "300% 100%",
                              opacity: 0.8,
                              zIndex: -1
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div className="z-10 flex w-full items-center justify-center space-x-2">
                          {getIconComponent(suggestion.iconName)}
                          <div className="line-clamp-2 text-center text-sm font-medium text-white">
                            {suggestion.name}
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-[220px] border border-gray-300 bg-white text-center text-black shadow-lg"
                    >
                      <p>{suggestion.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        <Dialog
          open={showPromptVariables}
          onOpenChange={isOpen => {
            console.log("Dialog open state changed to:", isOpen)
            setShowPromptVariables(isOpen)
          }}
        >
          <DialogContent
            onKeyDown={handleKeydownPromptVariables}
            className="gap-0 overflow-hidden p-0 sm:max-w-md"
          >
            {/* Red Header */}
            <div className="border-b bg-red-600 px-6 py-4 text-white">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                {selectedPrompt?.name || "Enter Text for Rephrasing"}
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-4 p-6">
              {/* Description */}
              <div>
                <p className=" text-sm font-medium">
                  {selectedPrompt?.content?.match(/\{\{(.*?)\}\}/)?.[1] ||
                    "Please provide your content for rephrasing"}
                </p>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <TextareaAutosize
                  placeholder="Type or paste your text here..."
                  value={promptContent}
                  onValueChange={setPromptContent}
                  minRows={6}
                  maxRows={10}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground flex min-h-[120px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                  onCompositionStart={() => setIsTyping(true)}
                  onCompositionEnd={() => setIsTyping(false)}
                />
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="bg-muted/50 border-t px-6 py-4">
              <Button
                variant="outline"
                onClick={handleCancelPromptVariables}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitPromptVariables}
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={!promptContent.trim()}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default SuggestionTiles
