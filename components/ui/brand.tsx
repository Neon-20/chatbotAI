"use client"

import { FC } from "react"

import Logo from "../icons/logo"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  return (
    <div
      className="flex cursor-pointer flex-col items-center hover:opacity-50"
      draggable="false"
    >
      <div draggable="false" onDragStart={e => e.preventDefault()}>
        <div className="mb-2" draggable="false">
          <Logo width={367.2} height={207.9} />
        </div>
      </div>
    </div>
  )
}
