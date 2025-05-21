import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { TextareaAutosize } from "@/components/ui/textarea-autosize"
import { ChatbotUIContext } from "@/context/context"
import { suggestionTilesContent } from "@/lib/suggestions/suggestion-tiles-content"
import { Tables } from "@/supabase/types"
import {
  IconBolt,
  IconFileText,
  IconMail,
  IconLanguage,
  IconFileDescription,
  IconCalendar,
  IconListDetails,
  IconWriting
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { useContext, useState } from "react"

function SuggestionTiles() {
  const { setUserInput } = useContext(ChatbotUIContext)

  const [showPromptVariables, setShowPromptVariables] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [promptVariables, setPromptVariables] = useState<
    {
      promptId: string
      name: string
      value: string
    }[]
  >([])
  const [selectedPrompt, setSelectedPrompt] =
    useState<Tables<"prompts"> | null>(null)

  // Function to get the appropriate icon component based on the icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "FileText":
        return (
          <IconWriting
            size={16}
            className="shrink-0"
            style={{
              color: "#FFFFFF",
              filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))"
            }}
          />
        )
      case "Mail":
        return (
          <IconMail
            size={16}
            className="shrink-0"
            style={{
              color: "#FFFFFF",
              filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))"
            }}
          />
        )
      case "Language":
        return (
          <IconLanguage
            size={16}
            className="shrink-0"
            style={{
              color: "#FFFFFF",
              filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))"
            }}
          />
        )
      case "FileDescription":
        return (
          <IconFileDescription
            size={16}
            className="shrink-0"
            style={{
              color: "#FFFFFF",
              filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))"
            }}
          />
        )
      case "Calendar":
        return (
          <IconCalendar
            size={16}
            className="shrink-0"
            style={{
              color: "#FFFFFF",
              filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))"
            }}
          />
        )
      case "ListDetails":
        return (
          <IconListDetails
            size={16}
            className="shrink-0"
            style={{
              color: "#FFFFFF",
              filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))"
            }}
          />
        )
      default:
        return (
          <IconBolt
            size={16}
            className="shrink-0"
            style={{
              color: "#FF7300",
              filter: "drop-shadow(0 0 2px rgba(255, 115, 0, 0.5))"
            }}
          />
        )
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion)
  }

  const handlePromptSelection = (suggestionContent: string) => {
    const testPrompt: Tables<"prompts"> = {
      id: "test-prompt-id",
      user_id: "test-user",
      name: "Test Prompt",
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
      const newPromptVariables = matches.map(match => ({
        promptId: testPrompt.id,
        name: match.replace(/\{\{|\}\}/g, ""),
        value: ""
      }))

      console.log("Setting prompt variables:", newPromptVariables)

      setPromptVariables(newPromptVariables)
      setSelectedPrompt(testPrompt)
      setShowPromptVariables(true)
    } else {
      // No variables, just use as input
      handleSuggestionClick(suggestionContent)
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
    if (!selectedPrompt) return

    const newPromptContent = promptVariables.reduce(
      (prevContent, variable) =>
        prevContent.replace(
          new RegExp(`\\{\\{${variable.name}\\}\\}`, "g"),
          variable.value
        ),
      selectedPrompt.content || ""
    )

    // Instead of using handleSelectPrompt with a prompt object,
    // just use the processed content directly
    setUserInput(newPromptContent)

    setShowPromptVariables(false)
    setPromptVariables([])
    setSelectedPrompt(null)
  }

  const handleCancelPromptVariables = () => {
    setShowPromptVariables(false)
    setPromptVariables([])
    setSelectedPrompt(null)
  }

  return (
    <motion.div
      style={{ transition: "all 0.2s ease-out" }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-full">
        <div
          className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg"
          style={{ boxSizing: "border-box" }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div
              className="animate-border-flow absolute inset-0 rounded-2xl"
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
              {suggestionTilesContent.map((suggestion, index) => (
                <motion.div
                  key={index}
                  className="relative flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black/80 px-3 py-2 text-gray-800 shadow-sm backdrop-blur-md dark:text-gray-200"
                  onClick={() => handlePromptSelection(suggestion.content)}
                  whileHover={{
                    scale: 1.06,
                    boxShadow:
                      "0 2px 8px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.05)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17
                  }}
                >
                  {/* AlterDomus orange-red border effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl p-[2px]">
                    <div
                      className="animate-border-flow absolute inset-0 rounded-xl"
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
                </motion.div>
              ))}
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
          <DialogContent onKeyDown={handleKeydownPromptVariables}>
            <DialogHeader>
              <DialogTitle>Enter Prompt Variables</DialogTitle>
            </DialogHeader>

            <div className="mt-2 space-y-6">
              {promptVariables.map((variable, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <Label>{variable.name}</Label>

                  <TextareaAutosize
                    placeholder={`Enter a value for ${variable.name}...`}
                    value={variable.value}
                    onValueChange={value => {
                      const newPromptVariables = [...promptVariables]
                      newPromptVariables[index].value = value
                      setPromptVariables(newPromptVariables)
                    }}
                    minRows={3}
                    maxRows={5}
                    onCompositionStart={() => setIsTyping(true)}
                    onCompositionEnd={() => setIsTyping(false)}
                  />
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelPromptVariables}
              >
                Cancel
              </Button>

              <Button size="sm" onClick={handleSubmitPromptVariables}>
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  )
}

export default SuggestionTiles
