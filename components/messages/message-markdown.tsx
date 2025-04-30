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
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const markdownRef = useRef<HTMLDivElement>(null);

  // Function to highlight the selected text
  const highlightSelectedText = (range: Range) => {
    // Remove any existing highlights first
    removeHighlights();

    // Create a span element with the highlight class
    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'highlighted-text';

    // Wrap the selected text in the highlight span
    try {
      range.surroundContents(highlightSpan);
      return highlightSpan;
    } catch (e) {
      console.error('Could not highlight text:', e);
      return null;
    }
  };

  // Function to remove all highlights
  const removeHighlights = () => {
    if (markdownRef.current) {
      const highlights = markdownRef.current.querySelectorAll('.highlighted-text');
      highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        if (parent) {
          // Move all children out of the highlight span
          while (highlight.firstChild) {
            parent.insertBefore(highlight.firstChild, highlight);
          }
          // Remove the empty highlight span
          parent.removeChild(highlight);
        }
      });
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Get the selected text
      const text = selection.toString().trim();
      setSelectedText(text);
      setSelectedRange(range.cloneRange()); // Store the range for highlighting

      // Highlight the selected text
      const highlightedElement = highlightSelectedText(range.cloneRange());

      // Calculate position for the quote icon - top right corner of the selection
      if (markdownRef.current && highlightedElement) {
        const containerRect = markdownRef.current.getBoundingClientRect();
        const highlightRect = highlightedElement.getBoundingClientRect();

        setSelectionPosition({
          x: highlightRect.right - containerRect.left - 10, // 10px offset from right edge
          y: highlightRect.top - containerRect.top - 5 // 5px above the top
        });
      } else if (markdownRef.current) {
        // Fallback if highlighting fails
        const containerRect = markdownRef.current.getBoundingClientRect();
        setSelectionPosition({
          x: rect.right - containerRect.left - 10,
          y: rect.top - containerRect.top - 5
        });
      }
    } else {
      // Clear selection when nothing is selected
      clearSelection();
    }
  };

  const clearSelection = () => {
    setSelectedText("");
    setSelectionPosition(null);
    setSelectedRange(null);
    removeHighlights();
  };

  // Clear selection when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (markdownRef.current && !markdownRef.current.contains(e.target as Node)) {
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

  return (
    <div ref={markdownRef} className="text-selection-active relative" onMouseUp={handleTextSelection}>
      {selectedText && selectionPosition && (
        <TextSelectionQuote
          selectedText={selectedText}
          position={selectionPosition}
          onClose={() => {
            clearSelection();
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
