import { IconBolt } from "@tabler/icons-react"
import { useContext, useState } from "react"
import { ChatbotUIContext } from "@/context/context"
import { initialSuggestions } from "@/lib/suggestions/custom-suggestions"
import { defaultSuggestion } from "@/lib/suggestion"
import { motion } from "framer-motion"

function SuggestionTiles() {
  // Access the ChatbotUIContext to set userInput directly and trigger prompt picker
  const { setUserInput, setIsPromptPickerOpen, setSlashCommand } =
    useContext(ChatbotUIContext)

  // Create a static array of suggestions by combining all available suggestion sets
  // We'll take 6 suggestions total - prioritizing the default suggestions
  const staticSuggestions = [
    ...defaultSuggestion,
    ...initialSuggestions.slice(0, Math.max(0, 6 - defaultSuggestion.length))
  ].slice(0, 6)

  // Use static suggestions
  const [suggestions] = useState<string[]>(staticSuggestions)

  return (
    <div className="w-full">
      <div
        className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg"
        style={{ boxSizing: "border-box" }}
      >
        {/* AlterDomus orange-red border for the card container */}
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

        {/* Inner content container with padding to show the border */}
        <div className="relative z-10 m-[4px] rounded-xl bg-white/95 p-5 dark:bg-gray-800/95">
          <div className="mb-4 flex flex-col items-center justify-center">
            <h3 className="text-muted-foreground mb-2 text-center text-sm font-medium dark:text-gray-300">
              What would you like to know?
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                className="relative flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black/80 px-3 py-2 text-gray-800 shadow-sm backdrop-blur-md dark:text-gray-200"
                onClick={() => {
                  // Extract a keyword from the suggestion to use as a search term
                  const searchTerm =
                    suggestion.split(" ")[1] || suggestion.split(" ")[0]

                  // Set the input to "/" and open the prompt picker with the search term
                  setUserInput("/")
                  setIsPromptPickerOpen(true)
                  setSlashCommand(searchTerm.toLowerCase())
                }}
                whileHover={{
                  scale: 1.01,
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
                  <IconBolt
                    size={16}
                    className="shrink-0"
                    style={{
                      color: "#FF7300",
                      filter: "drop-shadow(0 0 2px rgba(255, 115, 0, 0.5))"
                    }}
                  />
                  <div className="line-clamp-2 text-center text-sm font-medium text-white">
                    {suggestion}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuggestionTiles
