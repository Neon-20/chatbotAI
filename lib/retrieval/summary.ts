"use server"
import OpenAI from "openai"
import { checkApiKey, getServerProfile } from "../server/server-chat-helpers"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
import { defaultSuggestion } from "../suggestion"

export async function genSummary(text: string | undefined) {
  if (!text) {
    return "No data provided"
  }
  const profile = await getServerProfile()
  const prompt = `Please provide a concise summary of the following data.
  Focus on the key points, trends, and any significant insights or findings that are evident from the data. The summary should be clear and easily understandable to someone who is not familiar with the data: `

  checkApiKey(profile.azure_openai_api_key, "Azure OpenAI")

  const ENDPOINT = profile.azure_openai_endpoint
  const KEY = profile.azure_openai_api_key

  let DEPLOYMENT_ID = profile.azure_openai_4o_mini_id

  if (!ENDPOINT || !KEY || !DEPLOYMENT_ID) {
    return (
      JSON.stringify({ message: "Azure resources not found" }),
      {
        status: 400
      }
    )
  }

  const azureOpenai = new OpenAI({
    apiKey: KEY,
    baseURL: `${ENDPOINT}/openai/deployments/${DEPLOYMENT_ID}`,
    defaultQuery: { "api-version": "2023-12-01-preview" },
    defaultHeaders: { "api-key": KEY }
  })

  const response = await azureOpenai.chat.completions.create({
    model: DEPLOYMENT_ID as ChatCompletionCreateParamsBase["model"],
    messages: [
      { role: "user", content: prompt },
      { role: "user", content: text }
    ]
  })
  if (typeof response.choices[0].message.content == "string") {
    return response.choices[0].message.content
  }
  return "Error generating summary"
}

export async function genSuggestions({
  userQuery,
  filesData
}: {
  userQuery: string | undefined
  filesData:
    | {
        content: string
        tokens: number
      }[]
    | undefined
}) {
  if (!userQuery && !filesData) {
    return defaultSuggestion
  }
  const data = filesData?.map(file => file.content)

  const profile = await getServerProfile()
  const prompt = `
    Analyze this content: <content> {${userQuery}} </content>
    Along with the additional files data: ${data}
    Generate 3-5 suggestions that:
    Relate directly to the main topic/themes
    Encourage deeper exploration
    Cover different aspects of the topic
    Are phrased as questions or brief descriptions
    Cater to various interests within the topic
    Stick closely to the content, include only logically connected concepts, and avoid speculation.
    Present your output as: <output> suggestions = [ "First suggestion", "Second suggestion", "Third suggestion", "Fourth suggestion (if applicable)", "Fifth suggestion (if applicable)" ] </output>`

  checkApiKey(profile.azure_openai_api_key, "Azure OpenAI")

  const ENDPOINT = profile.azure_openai_endpoint
  const KEY = profile.azure_openai_api_key

  let DEPLOYMENT_ID = profile.azure_openai_4o_mini_id

  if (!ENDPOINT || !KEY || !DEPLOYMENT_ID) {
    return ["Azure resources not found"]
  }

  const azureOpenai = new OpenAI({
    apiKey: KEY,
    baseURL: `${ENDPOINT}/openai/deployments/${DEPLOYMENT_ID}`,
    defaultQuery: { "api-version": "2023-12-01-preview" },
    defaultHeaders: { "api-key": KEY }
  })

  const response = await azureOpenai.chat.completions.create({
    model: DEPLOYMENT_ID as ChatCompletionCreateParamsBase["model"],
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that extracts data and returns it in JSON format."
      },
      { role: "user", content: prompt }
    ],
    response_format: {
      type: "json_object"
    }
  })

  if (typeof response.choices[0].message.content == "string") {
    const res = response.choices[0].message.content
    const suggestions: string[] = JSON.parse(res).suggestions
    return suggestions
  }

  return ["Error generating suggestions"]
}
