import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { IconCheck, IconCopy, IconDownload, IconQuote } from "@tabler/icons-react"
import { FC, memo, useRef, useState, useEffect, useContext } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { WithTooltip } from "../ui/with-tooltip"
import { ChatbotUIContext } from "@/context/context"

interface MessageCodeBlockProps {
  language: string
  value: string
}

interface languageMap {
  [key: string]: string | undefined
}

export const programmingLanguages: languageMap = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css"
}

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXY3456789" // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return lowercase ? result.toLowerCase() : result
}

export const MessageCodeBlock: FC<MessageCodeBlockProps> = memo(
  ({ language, value }) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
    const { userInput, setUserInput } = useContext(ChatbotUIContext)

    const [selectedText, setSelectedText] = useState<string>("");
    const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
    const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
    const codeBlockRef = useRef<HTMLDivElement>(null);

    const downloadAsFile = () => {
      if (typeof window === "undefined") {
        return
      }
      const fileExtension = programmingLanguages[language] || ".file"
      const suggestedFileName = `file-${generateRandomString(
        3,
        true
      )}${fileExtension}`
      const fileName = window.prompt("Enter file name" || "", suggestedFileName)

      if (!fileName) {
        return
      }

      const blob = new Blob([value], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = fileName
      link.href = url
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    const onCopy = () => {
      if (isCopied) return
      copyToClipboard(value)
    }

    // Function to remove any existing highlights
    const removeHighlights = () => {
      if (highlightedElement) {
        highlightedElement.classList.remove('highlighted-text');
        setHighlightedElement(null);
      }
    };

    // Function to clear the selection
    const clearSelection = () => {
      setSelectedText("");
      setSelectionPosition(null);
      removeHighlights();
    };

    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Get the selected text
        const text = selection.toString().trim();
        setSelectedText(text);

        // For code blocks, we'll highlight the parent element of the selection
        // since we can't easily wrap the selection in a span due to the syntax highlighting
        let currentNode = range.startContainer;

        // Find the closest element node
        while (currentNode.nodeType !== Node.ELEMENT_NODE && currentNode.parentElement) {
          currentNode = currentNode.parentElement;
        }

        // Remove any existing highlights
        removeHighlights();

        // Add highlight class to the element
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
          const element = currentNode as HTMLElement;
          element.classList.add('highlighted-text');
          setHighlightedElement(element);

          // Calculate position for the quote icon - top right corner
          if (codeBlockRef.current) {
            const containerRect = codeBlockRef.current.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            setSelectionPosition({
              x: elementRect.right - containerRect.left - 10, // 10px offset from right edge
              y: elementRect.top - containerRect.top - 5 // 5px above the top
            });
          }
        } else {
          // Fallback if we can't find an element to highlight
          if (codeBlockRef.current) {
            const containerRect = codeBlockRef.current.getBoundingClientRect();
            setSelectionPosition({
              x: rect.right - containerRect.left - 10,
              y: rect.top - containerRect.top - 5
            });
          }
        }
      } else {
        // Clear selection when nothing is selected
        clearSelection();
      }
    };

    // Clear selection when clicking outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (codeBlockRef.current && !codeBlockRef.current.contains(e.target as Node)) {
          clearSelection();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Clean up highlights when component unmounts
    useEffect(() => {
      return () => {
        removeHighlights();
      };
    }, []);

    const handleQuoteClick = () => {
      // Add the selected text as a code block to the user input
      const quotedText = `\`\`\`${language}\n${selectedText}\n\`\`\`\n\n`;
      setUserInput(prevInput => {
        // If there's already content, add a newline before adding the quote
        if (prevInput.trim()) {
          return `${prevInput}\n\n${quotedText}`;
        }
        return quotedText;
      });
      clearSelection();
    };

    return (
      <div className="codeblock text-selection-active relative w-full bg-zinc-950 font-sans" ref={codeBlockRef} onMouseUp={handleTextSelection}>
        <div className="flex w-full items-center justify-between bg-zinc-700 px-4 text-white">
          <span className="text-xs lowercase">{language}</span>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
              onClick={downloadAsFile}
            >
              <IconDownload size={16} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-xs hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
              onClick={onCopy}
            >
              {isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            </Button>
          </div>
        </div>
        {selectedText && selectionPosition && (
          <div
            className="text-selection-quote"
            style={{
              left: `${selectionPosition.x}px`,
              top: `${selectionPosition.y - 40}px`
            }}
          >
            <WithTooltip
              delayDuration={500}
              side="top"
              display={<div>Quote selected code</div>}
              trigger={
                <IconQuote
                  className="cursor-pointer hover:opacity-50"
                  size={16}
                  onClick={handleQuoteClick}
                />
              }
            />
          </div>
        )}
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          // showLineNumbers
          customStyle={{
            margin: 0,
            width: "100%",
            background: "transparent"
          }}
          codeTagProps={{
            style: {
              fontSize: "14px",
              fontFamily: "var(--font-mono)"
            }
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    )
  }
)

MessageCodeBlock.displayName = "MessageCodeBlock"
