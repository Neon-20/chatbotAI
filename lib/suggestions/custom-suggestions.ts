// Custom suggestions for the chat interface
// These suggestions are more contextual and helpful for users

// Initial suggestions shown when the chat starts
export const initialSuggestions = [
  "What career opportunities are available at Alter Domus?",
  "Tell me about your product features",
  "What's new in the latest update?",
  "How do I get started with this app?",
  "Show me some example prompts",
  "What can this AI assistant do?"
]

// Suggestions for when users are asking about features
export const featureSuggestions = [
  "What are the key features?",
  "How do I use the analytics dashboard?",
  "Can you explain the reporting tools?",
  "How do I integrate with other systems?",
  "What security features are available?",
  "How do I customize the interface?"
]

// Suggestions for when users need help
export const helpSuggestions = [
  "I need help with setup",
  "How do I reset my password?",
  "Where can I find documentation?",
  "Is there a tutorial available?",
  "How do I contact support?",
  "What are the system requirements?"
]

// Suggestions for when users are exploring data
export const dataSuggestions = [
  "How do I import my data?",
  "Can you analyze this dataset?",
  "How do I create a visualization?",
  "What insights can you provide?",
  "How do I export results?",
  "Can you explain these metrics?"
]

/**
 * Get contextual suggestions based on the current conversation
 * @param conversation - The current conversation history
 * @returns An array of relevant suggestions
 */
export function getContextualSuggestions(conversation: string = ""): string[] {
  // If no conversation, return initial suggestions
  if (!conversation) {
    return initialSuggestions
  }

  const lowerConversation = conversation.toLowerCase()

  // Check for keywords to determine context
  if (
    lowerConversation.includes("feature") ||
    lowerConversation.includes("functionality") ||
    lowerConversation.includes("capability") ||
    lowerConversation.includes("can it do")
  ) {
    return featureSuggestions
  }

  if (
    lowerConversation.includes("help") ||
    lowerConversation.includes("support") ||
    lowerConversation.includes("assistance") ||
    lowerConversation.includes("problem") ||
    lowerConversation.includes("issue") ||
    lowerConversation.includes("trouble")
  ) {
    return helpSuggestions
  }

  if (
    lowerConversation.includes("data") ||
    lowerConversation.includes("analysis") ||
    lowerConversation.includes("report") ||
    lowerConversation.includes("metric") ||
    lowerConversation.includes("statistic") ||
    lowerConversation.includes("chart")
  ) {
    return dataSuggestions
  }

  // Default to initial suggestions if no context is detected
  return initialSuggestions
}

/**
 * Get a mix of suggestions from different categories
 * @returns An array of mixed suggestions
 */
export function getMixedSuggestions(): string[] {
  const allSuggestions = [
    ...initialSuggestions,
    ...featureSuggestions,
    ...helpSuggestions,
    ...dataSuggestions
  ]

  // Shuffle and pick 6 random suggestions
  return shuffleArray(allSuggestions).slice(0, 6)
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param array - The array to shuffle
 * @returns The shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
