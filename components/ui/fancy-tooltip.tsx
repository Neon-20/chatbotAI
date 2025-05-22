"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface FancyTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delayDuration?: number
  className?: string
}

export const FancyTooltip: React.FC<FancyTooltipProps> = ({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 300,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(
            "overflow-visible border-0 bg-transparent p-0 shadow-none",
            className
          )}
          sideOffset={8}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.8,
                  transition: {
                    duration: 0.15
                  }
                }}
                className="relative rounded-lg border border-gray-700 bg-white px-4 py-2 text-black shadow-lg backdrop-blur-md"
              >
                {/* Decorative elements */}
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-1/5 bg-gradient-to-r from-transparent  to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-2/5 bg-gradient-to-r from-transparent  to-transparent" />

                {/* Arrow/pointer */}
                <div
                  className={cn(
                    "absolute size-2 rotate-45 border-gray-700 bg-white",
                    side === "top" && "bottom-[-5px] border-b border-r",
                    side === "bottom" && "top-[-5px] border-l border-t",
                    side === "left" && "right-[-5px] border-r border-t",
                    side === "right" && "left-[-5px] border-b border-l",
                    align === "center" && "left-1/2 -translate-x-1/2",
                    align === "start" && "left-2",
                    align === "end" && "right-2"
                  )}
                />

                {/* Content */}
                <div className="relative z-10 text-sm">{content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
