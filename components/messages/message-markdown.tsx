import React, { FC, useRef, useState, useEffect } from "react"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { MessageCodeBlock } from "./message-codeblock"
import { MessageMarkdownMemoized } from "./message-markdown-memoized"
import rehypeKatex from "rehype-katex"
import { TextSelectionQuote } from "./text-selection-quote"

interface MessageMarkdownProps {
  content: string
}

const replaceMathDelimiters = (content: string) => {
  return content
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$")
    .replace(/\\\[/g, "\n$$")
    .replace(/\\\]/g, "$$\n")
}

export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content }) => {
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const markdownRef = useRef<HTMLDivElement>(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Get the selected text
      const text = selection.toString().trim();
      setSelectedText(text);

      // Calculate position for the quote icon
      if (markdownRef.current) {
        const containerRect = markdownRef.current.getBoundingClientRect();
        setSelectionPosition({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top
        });
      }
    } else {
      // Clear selection when nothing is selected
      setSelectedText("");
      setSelectionPosition(null);
    }
  };

  // Clear selection when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (markdownRef.current && !markdownRef.current.contains(e.target as Node)) {
        setSelectedText("");
        setSelectionPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={markdownRef} className="text-selection-active relative" onMouseUp={handleTextSelection}>
      {selectedText && selectionPosition && (
        <TextSelectionQuote
          selectedText={selectedText}
          position={selectionPosition}
          onClose={() => {
            setSelectedText("");
            setSelectionPosition(null);
          }}
        />
      )}
      <MessageMarkdownMemoized
        className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words"
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>
        },
        img({ node, ...props }) {
          return <img className="max-w-[67%]" {...props} />
        },
        code({ node, className, children, ...props }) {
          const childArray = React.Children.toArray(children)
          const firstChild = childArray[0] as React.ReactElement
          const secondChild = childArray[1] as React.ReactElement
          const firstChildAsString = React.isValidElement(firstChild)
            ? (firstChild as React.ReactElement).props.children
            : firstChild
          const secondChildAsString = React.isValidElement(secondChild)
            ? (secondChild as React.ReactElement).props.children
            : secondChild

          if (firstChildAsString === "▍") {
            return <span className="mt-1 animate-pulse cursor-default">▍</span>
          }

          if (typeof firstChildAsString === "string") {
            childArray[0] = firstChildAsString.replace("`▍`", "▍")
          }

          const match = /language-(\w+)/.exec(className || "")

          if (
            typeof firstChildAsString === "string" &&
            !firstChildAsString.includes("\n")
          ) {
            return (
              <code className={className} {...props}>
                {childArray}
              </code>
            )
          }

          return (
            <MessageCodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(childArray).replace(/\n$/, "")}
              {...props}
            />
          )
        }
      }}
    >
      {replaceMathDelimiters(content)}
    </MessageMarkdownMemoized>
    </div>
  )
}
