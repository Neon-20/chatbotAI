"use client"
import Lottie from "lottie-react"
import animationData from "./Animation - 1740847542715.json"

export default function Loading() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <Lottie
        animationData={animationData}
        loop
        className="size-96 text-orange-500"
      />
    </div>
  )
}
