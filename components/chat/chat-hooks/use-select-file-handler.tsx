import { ChatbotUIContext } from "@/context/context"
import { createDocXFile, createFile } from "@/db/files"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import mammoth from "mammoth"
import { useContext, useEffect, useState, useCallback } from "react"
import { toast } from "sonner"

export const ACCEPTED_FILE_TYPES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/json",
  "text/markdown",
  "application/pdf",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/javascript",
  "application/javascript",
  "text/typescript",
  "application/typescript",
  "text/x-python",
  "application/x-python",
  "text/x-python-script",
  "text/html",
  "text/css",
  "application/x-httpd-php",
  "text/x-php",
  "text/x-markdown",
  ".js",
  ".ts",
  ".tsx",
  ".py",
  ".jsx",
  ".html",
  ".css",
  ".php",
  ".cs",
  ".md",
  ".mdx"
].join(",")

export const useSelectFileHandler = () => {
  const {
    selectedWorkspace,
    profile,
    chatSettings,
    setNewMessageImages,
    setNewMessageFiles,
    setShowFilesDisplay,
    setFiles,
    setUseRetrieval
  } = useContext(ChatbotUIContext)

  const [filesToAccept, setFilesToAccept] = useState(ACCEPTED_FILE_TYPES)

  const handleFilesToAccept = useCallback(() => {
    const model = chatSettings?.model
    const FULL_MODEL = LLM_LIST.find(llm => llm.modelId === model)

    if (!FULL_MODEL) return

    setFilesToAccept(
      FULL_MODEL.imageInput
        ? `${ACCEPTED_FILE_TYPES},image/*`
        : ACCEPTED_FILE_TYPES
    )
  }, [chatSettings?.model, setFilesToAccept])

  useEffect(() => {
    handleFilesToAccept()
  }, [handleFilesToAccept])

  const handleSelectDeviceFile = async (file: File) => {
    if (!profile || !selectedWorkspace || !chatSettings) return

    setShowFilesDisplay(true)
    setUseRetrieval(true)

    if (file) {
      let simplifiedFileType = file.type.split("/")[1] || ""

      let reader = new FileReader()

      if (file.type.includes("image")) {
        reader.readAsDataURL(file)
      } else if (
        ACCEPTED_FILE_TYPES.split(",").includes(file.type) ||
        file.name.endsWith(".js") ||
        file.name.endsWith(".ts") ||
        file.name.endsWith(".tsx") ||
        file.name.endsWith(".py") ||
        file.name.endsWith(".jsx") ||
        file.name.endsWith(".html") ||
        file.name.endsWith(".css") ||
        file.name.endsWith(".php") ||
        file.name.endsWith(".cs") ||
        file.name.endsWith(".md") ||
        file.name.endsWith(".mdx")
      ) {
        // Determine file type based on extension first, then MIME type
        if (file.name.endsWith(".js")) {
          simplifiedFileType = "js"
        } else if (file.name.endsWith(".ts")) {
          simplifiedFileType = "ts"
        } else if (file.name.endsWith(".tsx")) {
          simplifiedFileType = "tsx"
        } else if (file.name.endsWith(".py")) {
          simplifiedFileType = "py"
        } else if (file.name.endsWith(".jsx")) {
          simplifiedFileType = "jsx"
        } else if (file.name.endsWith(".html")) {
          simplifiedFileType = "html"
        } else if (file.name.endsWith(".css")) {
          simplifiedFileType = "css"
        } else if (file.name.endsWith(".php")) {
          simplifiedFileType = "php"
        } else if (file.name.endsWith(".cs")) {
          simplifiedFileType = "cs"
        } else if (file.name.endsWith(".md")) {
          simplifiedFileType = "md"
        } else if (file.name.endsWith(".mdx")) {
          simplifiedFileType = "mdx"
        } else if (
          simplifiedFileType &&
          simplifiedFileType.includes("vnd.adobe.pdf")
        ) {
          simplifiedFileType = "pdf"
        } else if (
          (simplifiedFileType &&
            simplifiedFileType.includes(
              "vnd.openxmlformats-officedocument.wordprocessingml.document"
            )) ||
          (simplifiedFileType && simplifiedFileType.includes("docx"))
        ) {
          simplifiedFileType = "docx"
        } else if (
          (simplifiedFileType && simplifiedFileType.includes("vnd.ms-excel")) ||
          (simplifiedFileType && simplifiedFileType.includes("xls"))
        ) {
          simplifiedFileType = "xls"
        } else if (
          (simplifiedFileType &&
            simplifiedFileType.includes(
              "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )) ||
          (simplifiedFileType && simplifiedFileType.includes("xlsx"))
        ) {
          simplifiedFileType = "xlsx"
        } else if (
          (simplifiedFileType &&
            simplifiedFileType.includes(
              "vnd.openxmlformats-officedocument.presentationml.presentation"
            )) ||
          (simplifiedFileType && simplifiedFileType.includes("pptx"))
        ) {
          simplifiedFileType = "pptx"
        } else if (file.type.includes("javascript")) {
          simplifiedFileType = "js"
        } else if (file.type.includes("typescript")) {
          simplifiedFileType = "ts"
        } else if (file.type.includes("python")) {
          simplifiedFileType = "py"
        }

        setNewMessageFiles(prev => [
          ...prev,
          {
            id: "loading",
            name: file.name,
            type: simplifiedFileType,
            file: file
          }
        ])

        // Handle docx files
        if (
          file.type.includes(
            "vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) ||
          file.type.includes("docx")
        ) {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.extractRawText({
            arrayBuffer
          })

          const createdFile = await createDocXFile(
            result.value,
            file,
            {
              user_id: profile.user_id,
              description: "",
              file_path: "",
              name: file.name,
              size: file.size,
              tokens: 0,
              type: simplifiedFileType
            },
            selectedWorkspace.id,
            chatSettings.embeddingsProvider
          )

          setFiles(prev => [...prev, createdFile])

          setNewMessageFiles(prev =>
            prev.map(item =>
              item.id === "loading"
                ? {
                    id: createdFile.id,
                    name: createdFile.name,
                    type: createdFile.type,
                    file: file
                  }
                : item
            )
          )

          reader.onloadend = null

          return
        } else {
          // Use readAsArrayBuffer for PDFs and readAsText for other types
          file.type.includes("pdf")
            ? reader.readAsArrayBuffer(file)
            : reader.readAsText(file)
        }
      } else {
        if (file.type === "application/zip") {
          toast.error("Zip files are not supported.")
          return
        } else {
          toast.error("Unsupported file type")
        }
      }

      reader.onloadend = async function () {
        try {
          if (file.type.includes("image")) {
            // Create a temp url for the image file
            const imageUrl = URL.createObjectURL(file)

            // This is a temporary image for display purposes in the chat input
            setNewMessageImages(prev => [
              ...prev,
              {
                messageId: "temp",
                path: "",
                base64: reader.result, // base64 image
                url: imageUrl,
                file
              }
            ])
          } else {
            const createdFile = await createFile(
              file,
              {
                user_id: profile.user_id,
                description: "",
                file_path: "",
                name: file.name,
                size: file.size,
                tokens: 0,
                type: simplifiedFileType
              },
              selectedWorkspace.id,
              chatSettings.embeddingsProvider
            )

            setFiles(prev => [...prev, createdFile])

            setNewMessageFiles(prev =>
              prev.map(item =>
                item.id === "loading"
                  ? {
                      id: createdFile.id,
                      name: createdFile.name,
                      type: createdFile.type,
                      file: file
                    }
                  : item
              )
            )
          }
        } catch (error: any) {
          toast.error("Upload failed: Unsupported PDF content", {
            duration: 10000
          })
          setNewMessageImages(prev =>
            prev.filter(img => img.messageId !== "temp")
          )
          setNewMessageFiles(prev => prev.filter(file => file.id !== "loading"))
        }
      }
    }
  }

  return {
    handleSelectDeviceFile,
    filesToAccept
  }
}
