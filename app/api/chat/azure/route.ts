import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatAPIPayload } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextRequest } from "next/server"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  const json = await request.json()
  let region = request.nextUrl.searchParams.get("region") || "sweden"
  const { chatSettings, messages } = json as ChatAPIPayload

  try {
    const profile = await getServerProfile()

    let ENDPOINT
    let KEY
    let DEPLOYMENT_ID = ""

    switch (region) {
      case "uksouth":
        checkApiKey(
          profile.azure_openai_europe_api_key as string | null,
          "Azure OpenAI Europe"
        )
        ENDPOINT = profile.azure_openai_europe_endpoint
        KEY = profile.azure_openai_europe_api_key as string | null
        console.log("Using Azure OpenAI UK South")

        switch (chatSettings.model) {
          case "gpt-4o-mini":
            DEPLOYMENT_ID = (profile.azure_openai_4o_mini_europe_id ||
              "") as string
            break
          default:
            return new Response(
              JSON.stringify({ message: "Model not found" }),
              {
                status: 400
              }
            )
        }
        break
      case "switzerland":
        checkApiKey(
          profile.azure_openai_swiss_endpoint as string | null,
          "Azure OpenAI Switzerland"
        )
        ENDPOINT = profile.azure_openai_swiss_endpoint as string | null
        KEY = profile.azure_openai_swiss_api_key as string | null
        console.log("Using Azure OpenAI Sweden")

        switch (chatSettings.model) {
          case "gpt-4o-mini":
            DEPLOYMENT_ID = String(profile.azure_openai_4o_mini_swiss_id) || ""
            break
          case "gpt-4o":
            DEPLOYMENT_ID = profile.azure_openai_4o_id || ""
            break
          case "o1-preview":
            DEPLOYMENT_ID = profile.azure_openai_o1_preview_id || ""
            break
          default:
            return new Response(
              JSON.stringify({ message: "Model not found" }),
              {
                status: 400
              }
            )
        }
        break
      default:
        checkApiKey(profile.azure_openai_api_key, "Azure OpenAI")
        ENDPOINT = profile.azure_openai_endpoint
        KEY = profile.azure_openai_api_key
        console.log("Using Azure OpenAI Sweden")

        switch (chatSettings.model) {
          case "gpt-4o-mini":
            DEPLOYMENT_ID = profile.azure_openai_4o_mini_id || ""
            break
          case "gpt-4o":
            DEPLOYMENT_ID = profile.azure_openai_4o_id || ""
            break
          case "o1-preview":
            DEPLOYMENT_ID = profile.azure_openai_o1_preview_id || ""
            break
          case "o1":
            DEPLOYMENT_ID = profile.azure_openai_o1_id || ""
            break
          case "o1-mini":
            DEPLOYMENT_ID = profile.azure_openai_o1_mini_id || ""
            break
          case "o3-mini":
            DEPLOYMENT_ID = String(profile.azure_openai_o3_mini_id) || ""
            break
          default:
            return new Response(
              JSON.stringify({ message: "Model not found" }),
              {
                status: 400
              }
            )
        }
        break
    }
    if (!ENDPOINT || !KEY || !DEPLOYMENT_ID) {
      console.error({
        ENDPOINT: ENDPOINT,
        KEY: KEY,
        DEPLOYMENT_ID: DEPLOYMENT_ID
      })
      return new Response(
        JSON.stringify({ message: "Azure resources not found" }),
        {
          status: 400
        }
      )
    }

    const azureOpenai = new OpenAI({
      apiKey: KEY,
      baseURL: `${ENDPOINT}/openai/deployments/${DEPLOYMENT_ID}`,
      defaultQuery: { "api-version": "2024-12-01-preview" },
      defaultHeaders: { "api-key": KEY }
    })
    if (
      chatSettings.model === "o1-preview" ||
      chatSettings.model === "o1" ||
      chatSettings.model === "o1-mini" ||
      chatSettings.model === "o3-mini"
    ) {
      const completion = await azureOpenai.chat.completions.create({
        model: DEPLOYMENT_ID,
        messages: messages.filter(
          message => message.role != "system"
        ) as ChatCompletionCreateParamsBase["messages"]
      })
      return new Response(completion.choices[0].message.content)
    }

    const response = await azureOpenai.chat.completions.create({
      model: DEPLOYMENT_ID as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: chatSettings.temperature,
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
