"use client"

import Link from "next/link"
import { FC } from "react"

import Logo from "../icons/logo"

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
      <div draggable="false" onDragStart={e => e.preventDefault()}>
        <div className="mb-2" draggable="false">
          <Logo width={367.2} height={207.9} />
        </div>
      </div>
    </Link>
  )
}
