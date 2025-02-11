import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/browser-client"
import { genSummary } from "@/lib/retrieval/summary"
import { ChatFile } from "@/types"
import Loading from "@/app/[locale]/loading"
import { MessageMarkdown } from "./messages/message-markdown"
import { Separator } from "./ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { WithTooltip } from "./ui/with-tooltip"
import { IconCheck, IconCopy } from "@tabler/icons-react"
import { MESSAGE_ICON_SIZE } from "./messages/message-actions"

export function SummarySheet({
  children,
  file
}: {
  file: ChatFile
  children: React.ReactNode
}) {
  const [summaries, setSummaries] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCheckmark, setShowCheckmark] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("file_items")
          .select()
          .eq("file_id", file.id)

        if (error || !data) {
          throw new Error("Failed to fetch data")
        }

        const batches = createBatches(data)

        const summariesPromises = batches.map(async batch => {
          const batchContent = batch.map(d => d.content).join("\n")
          const summary = await genSummary(batchContent)
          if (!summary) {
            throw new Error("Failed to generate summary")
          }
          return summary
        })

        const generatedSummaries: any = await Promise.all(summariesPromises)
        setSummaries(generatedSummaries)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [file.id])

  const handleCopy = (summary: string) => {
    setShowCheckmark(true)
    navigator.clipboard.writeText(summary)
    setTimeout(() => setShowCheckmark(false), 1000)
  }

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="h-full min-w-[50%] overflow-auto scroll-smooth">
        <SheetHeader>
          <SheetTitle>Summary of {file.name}</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          summaries.map((summary, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between">
                {summaries.length > 1 && (
                  <div className="my-4 text-4xl font-extrabold leading-none tracking-tight">
                    Part {index + 1}
                  </div>
                )}
                <WithTooltip
                  delayDuration={1000}
                  side="bottom"
                  display={<div>Copy</div>}
                  trigger={
                    showCheckmark ? (
                      <IconCheck size={MESSAGE_ICON_SIZE} />
                    ) : (
                      <IconCopy
                        className="cursor-pointer hover:opacity-50"
                        size={MESSAGE_ICON_SIZE}
                        onClick={() => handleCopy(summary)}
                      />
                    )
                  }
                />
              </div>
              <Separator className="my-4" />
              <MessageMarkdown content={summary} />
            </React.Fragment>
          ))
        )}
      </SheetContent>
    </Sheet>
  )
}

export function createBatches(
  data: {
    content: string
    created_at: string
    file_id: string
    id: string
    local_embedding: string | null
    openai_embedding: string | null
    sharing: string
    tokens: number
    updated_at: string | null
    user_id: string
  }[]
) {
  if (!data || !Array.isArray(data)) return []

  const batches = []
  let currentBatch = []
  let currentTokenCount = 0
  const TOKEN_LIMIT = 100000

  for (const item of data) {
    if (currentTokenCount + item.tokens > TOKEN_LIMIT) {
      if (currentBatch.length > 0) {
        batches.push(currentBatch)
        currentBatch = []
        currentTokenCount = 0
      }
    }
    currentBatch.push(item)
    currentTokenCount += item.tokens

    if (currentTokenCount >= TOKEN_LIMIT) {
      batches.push(currentBatch)
      currentBatch = []
      currentTokenCount = 0
    }
  }
  if (currentBatch.length > 0) {
    batches.push(currentBatch)
  }

  return batches
}
