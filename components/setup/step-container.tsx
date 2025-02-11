import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { FC, useRef } from "react"
import Image from "next/image"
import { toast } from "sonner"

export const SETUP_STEP_COUNT = 2

interface StepContainerProps {
  stepDescription: string
  stepNum: number
  stepTitle: string
  onShouldProceed: (shouldProceed: boolean) => void
  children?: React.ReactNode
  showBackButton?: boolean
  showNextButton?: boolean
}

export const StepContainer: FC<StepContainerProps> = ({
  stepDescription,
  stepNum,
  stepTitle,
  onShouldProceed,
  children,
  showBackButton = false,
  showNextButton = true
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (buttonRef.current) {
        buttonRef.current.click()
      }
    }
  }
  const handleNextButtonClick = () => {
    if (localStorage.getItem("region") === null) {
      localStorage.setItem("region", "sweden")
    }
    onShouldProceed(true)
  }

  return (
    <Card
      className="relative max-h-[calc(100vh-60px)] w-[600px] overflow-auto backdrop-blur-md"
      onKeyDown={handleKeyDown}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div>{stepTitle}</div>
          <Image
            src="/images/image.png"
            width={50}
            height={40}
            alt={""}
            className="absolute right-4 top-3 object-contain"
          />
        </CardTitle>
        <CardDescription>{stepDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">{children}</CardContent>

      <CardFooter className="flex justify-between">
        <div>
          {showBackButton && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onShouldProceed(false)}
            >
              Back
            </Button>
          )}
        </div>

        <div>
          {showNextButton && (
            <Button ref={buttonRef} size="sm" onClick={handleNextButtonClick}>
              Next
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
