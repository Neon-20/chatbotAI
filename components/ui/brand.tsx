"use client"

import Link from "next/link"
import { FC } from "react"
import { ChatbotUISVG } from "../icons/chatbotui-svg"
import Logo from "../icons/logo"
import { motion } from "framer-motion"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  return (
    <Link
      className="flex cursor-pointer flex-col items-center hover:opacity-50"
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      draggable="false"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        draggable="false"
        onDragStart={e => e.preventDefault()}
      >
        <div className="mb-2" draggable="false">
          <Logo width={367.2} height={207.9} />
        </div>
      </motion.div>
    </Link>
  )
}
