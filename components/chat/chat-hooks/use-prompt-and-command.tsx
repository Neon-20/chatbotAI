import { ChatbotUIContext } from "@/context/context"
import { getAssistantCollectionsByAssistantId } from "@/db/assistant-collections"
import { getAssistantFilesByAssistantId } from "@/db/assistant-files"
import { getAssistantToolsByAssistantId } from "@/db/assistant-tools"
import { getCollectionFilesByCollectionId } from "@/db/collection-files"
import { Tables } from "@/supabase/types"
import { LLMID } from "@/types"
import { useContext, useCallback, useMemo } from "react"

export const usePromptAndCommand = () => {
  const {
    chatFiles,
    setNewMessageFiles,
    userInput,
    setUserInput,
    setShowFilesDisplay,
    setIsPromptPickerOpen,
    setIsFilePickerOpen,
    setSlashCommand,
    setHashtagCommand,
    setUseRetrieval,
    setToolCommand,
    setIsToolPickerOpen,
    setSelectedTools,
    setAtCommand,
    setIsAssistantPickerOpen,
    setSelectedAssistant,
    setChatSettings,
    setChatFiles
  } = useContext(ChatbotUIContext)

  // Memoize regex patterns to avoid recreating them on every call
  const regexPatterns = useMemo(
    () => ({
      atTextRegex: /@([^ ]*)$/,
      slashTextRegex: /\/([^ ]*)$/,
      hashtagTextRegex: /#([^ ]*)$/
    }),
    []
  )

  const handleInputChange = useCallback(
    (value: string) => {
      // Update input immediately for UI responsiveness
      setUserInput(value)

      // Only process commands if the value ends with a special character
      const lastChar = value.slice(-1)
      if (!["@", "/", "#"].includes(lastChar) && !value.match(/[@/#][^ ]*$/)) {
        // Reset all pickers if no command pattern is found
        setIsPromptPickerOpen(false)
        setIsFilePickerOpen(false)
        setIsToolPickerOpen(false)
        setIsAssistantPickerOpen(false)
        setSlashCommand("")
        setHashtagCommand("")
        setToolCommand("")
        setAtCommand("")
        return
      }

      const { atTextRegex, slashTextRegex, hashtagTextRegex } = regexPatterns
      const atMatch = value.match(atTextRegex)
      const slashMatch = value.match(slashTextRegex)
      const hashtagMatch = value.match(hashtagTextRegex)

      if (atMatch) {
        setIsAssistantPickerOpen(true)
        setAtCommand(atMatch[1])
        // Close other pickers
        setIsPromptPickerOpen(false)
        setIsFilePickerOpen(false)
        setIsToolPickerOpen(false)
      } else if (slashMatch) {
        setIsPromptPickerOpen(true)
        setSlashCommand(slashMatch[1])
        // Close other pickers
        setIsAssistantPickerOpen(false)
        setIsFilePickerOpen(false)
        setIsToolPickerOpen(false)
      } else if (hashtagMatch) {
        setIsFilePickerOpen(true)
        setHashtagCommand(hashtagMatch[1])
        // Close other pickers
        setIsPromptPickerOpen(false)
        setIsAssistantPickerOpen(false)
        setIsToolPickerOpen(false)
      } else {
        // Reset all pickers
        setIsPromptPickerOpen(false)
        setIsFilePickerOpen(false)
        setIsToolPickerOpen(false)
        setIsAssistantPickerOpen(false)
        setSlashCommand("")
        setHashtagCommand("")
        setToolCommand("")
        setAtCommand("")
      }
    },
    [
      regexPatterns,
      setUserInput,
      setIsPromptPickerOpen,
      setIsFilePickerOpen,
      setIsToolPickerOpen,
      setIsAssistantPickerOpen,
      setSlashCommand,
      setHashtagCommand,
      setToolCommand,
      setAtCommand
    ]
  )

  const handleSelectPrompt = (prompt: Tables<"prompts">) => {
    setIsPromptPickerOpen(false)
    setUserInput(userInput.replace(/\/[^ ]*$/, "") + prompt.content)
  }

  const handleSelectUserFile = async (file: Tables<"files">) => {
    setShowFilesDisplay(true)
    setIsFilePickerOpen(false)
    setUseRetrieval(true)

    setNewMessageFiles(prev => {
      const fileAlreadySelected =
        prev.some(prevFile => prevFile.id === file.id) ||
        chatFiles.some(chatFile => chatFile.id === file.id)

      if (!fileAlreadySelected) {
        return [
          ...prev,
          {
            id: file.id,
            name: file.name,
            type: file.type,
            file: null
          }
        ]
      }
      return prev
    })

    setUserInput(userInput.replace(/#[^ ]*$/, ""))
  }

  const handleSelectUserCollection = async (
    collection: Tables<"collections">
  ) => {
    setShowFilesDisplay(true)
    setIsFilePickerOpen(false)
    setUseRetrieval(true)

    const collectionFiles = await getCollectionFilesByCollectionId(
      collection.id
    )

    setNewMessageFiles(prev => {
      const newFiles = collectionFiles.files
        .filter(
          file =>
            !prev.some(prevFile => prevFile.id === file.id) &&
            !chatFiles.some(chatFile => chatFile.id === file.id)
        )
        .map(file => ({
          id: file.id,
          name: file.name,
          type: file.type,
          file: null
        }))

      return [...prev, ...newFiles]
    })

    setUserInput(userInput.replace(/#[^ ]*$/, ""))
  }

  const handleSelectTool = (tool: Tables<"tools">) => {
    setIsToolPickerOpen(false)
    setUserInput(userInput.replace(/![^ ]*$/, ""))
    setSelectedTools(prev => [...prev, tool])
  }

  const handleSelectAssistant = async (assistant: Tables<"assistants">) => {
    setIsAssistantPickerOpen(false)
    setUserInput(userInput.replace(/@[^ ]*$/, ""))
    setSelectedAssistant(assistant)

    setChatSettings({
      model: assistant.model as LLMID,
      prompt: assistant.prompt,
      temperature: assistant.temperature,
      contextLength: assistant.context_length,
      includeProfileContext: assistant.include_profile_context,
      includeWorkspaceInstructions: assistant.include_workspace_instructions,
      embeddingsProvider: assistant.embeddings_provider as "openai" | "local"
    })

    let allFiles = []

    const assistantFiles = (await getAssistantFilesByAssistantId(assistant.id))
      .files
    allFiles = [...assistantFiles]
    const assistantCollections = (
      await getAssistantCollectionsByAssistantId(assistant.id)
    ).collections
    for (const collection of assistantCollections) {
      const collectionFiles = (
        await getCollectionFilesByCollectionId(collection.id)
      ).files
      allFiles = [...allFiles, ...collectionFiles]
    }
    const assistantTools = (await getAssistantToolsByAssistantId(assistant.id))
      .tools

    setSelectedTools(assistantTools)
    setChatFiles(
      allFiles.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        file: null
      }))
    )

    if (allFiles.length > 0) setShowFilesDisplay(true)
  }

  return {
    handleInputChange,
    handleSelectPrompt,
    handleSelectUserFile,
    handleSelectUserCollection,
    handleSelectTool,
    handleSelectAssistant
  }
}
