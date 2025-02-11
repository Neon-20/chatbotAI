"use client"

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import Logo from "@/components/icons/logo"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { people } from "@/lib/people"
import { IconArrowRight } from "@tabler/icons-react"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const { theme } = useTheme()

  return (
    <div className="max-w-auto mt-8 flex min-h-screen flex-col items-center justify-center p-4">
      <Card
        className={`mt-6 w-full max-w-3xl border-2 shadow-xl ${theme === "dark" ? "bg-white text-white" : "bg-white"}`}
      >
        <CardHeader className="flex flex-col items-center space-y-2">
          <div className="flex flex-col items-center">
            <div className="size-auto">
              <Logo width={120} height={120} />
            </div>
            <span
              className={`mt-2 text-sm ${theme === "dark" ? "text-black" : "text-gray-500"}`}
            >
              v2.0
            </span>
          </div>
          <h2 className="text-center text-xl font-bold text-black lg:text-2xl">
            Let&apos;s transform the way we work together!
          </h2>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p
            className={`text-lg lg:text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            Experience the power of our <i>Internal ChatGPT</i> your AI-driven
            assistant designed to enhance productivity and streamline your
            workday.
          </p>
          <div className="text-left">
            <h3 className="mb-4 text-xl font-semibold lg:text-2xl">
              Key Benefits:
            </h3>
            <ul
              className={`space-y-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              {[
                "<strong>Boosted Efficiency:</strong> Achieve tasks faster by streamlining email writing, development, content creation, and documentation with our AI tools.",
                "<strong>Instant Access to Information:</strong> Get answers and insights right at your fingertips.",
                "<strong>Enhanced Job Satisfaction:</strong> Enjoy a more fulfilling work experience with supportive tools.",
                "<strong>Data Privacy Assurance:</strong> Your data remains confidential and secure; we never use it for training purposes."
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 size-5 shrink-0 text-green-500" />
                  <span dangerouslySetInnerHTML={{ __html: benefit }} />
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-lg"
          >
            <Button className="flex w-full max-w-md items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-red-700">
              Get started
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </Link>
          <div className="mt-2 flex flex-col items-center text-center">
            <div className="flex cursor-pointer">
              <AnimatedTooltip items={people} />
            </div>
            <p
              className={`max-w-[300px] text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Driven and Maintained by the AI - Automation & Cloud Engineering
              Team at AD
            </p>
          </div>
        </CardFooter>
      </Card>
      <footer
        className={`mb-4 py-2 text-center text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
      >
        Alter Domus, AiD © Copyright 2024. All rights reserved.
      </footer>
    </div>
  )
}
