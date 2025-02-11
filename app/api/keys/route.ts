import { isUsingEnvironmentKey } from "@/lib/envs"
import { createResponse } from "@/lib/server/server-utils"
import { EnvKey } from "@/types/key-type"
import { VALID_ENV_KEYS } from "@/types/valid-keys"

export async function GET() {
  const envKeyMap: Record<string, VALID_ENV_KEYS> = {
    azure: VALID_ENV_KEYS.AZURE_OPENAI_SWEDEN_API_KEY,
    azure_europe: VALID_ENV_KEYS.AZURE_OPENAI_EUROPE_API_KEY,
    azure_swiss: VALID_ENV_KEYS.AZURE_OPENAI_SWISS_API_KEY,
    openai: VALID_ENV_KEYS.OPENAI_API_KEY,
    google: VALID_ENV_KEYS.GOOGLE_GEMINI_API_KEY,
    anthropic: VALID_ENV_KEYS.ANTHROPIC_API_KEY,
    mistral: VALID_ENV_KEYS.MISTRAL_API_KEY,
    groq: VALID_ENV_KEYS.GROQ_API_KEY,
    perplexity: VALID_ENV_KEYS.PERPLEXITY_API_KEY,
    openrouter: VALID_ENV_KEYS.OPENROUTER_API_KEY,
    openai_organization_id: VALID_ENV_KEYS.OPENAI_ORGANIZATION_ID,
    // europe
    azure_openai_europe_endpoint: VALID_ENV_KEYS.AZURE_OPENAI_EUROPE_ENDPOINT,
    azure_openai_4o_europe_name: VALID_ENV_KEYS.AZURE_GPT_4o_EUROPE_NAME,
    azure_openai_4o_mini_europe_name:
      VALID_ENV_KEYS.AZURE_GPT_4o_MINI_EUROPE_NAME,
    // sweden
    azure_openai_endpoint: VALID_ENV_KEYS.AZURE_OPENAI_ENDPOINT,
    azure_gpt_35_turbo_name: VALID_ENV_KEYS.AZURE_GPT_35_TURBO_NAME,
    azure_gpt_45_vision_name: VALID_ENV_KEYS.AZURE_GPT_45_VISION_NAME,
    azure_gpt_45_turbo_name: VALID_ENV_KEYS.AZURE_GPT_45_TURBO_NAME,
    azure_embeddings_name: VALID_ENV_KEYS.AZURE_EMBEDDINGS_NAME,

    azure_openai_swiss_endpoint: VALID_ENV_KEYS.AZURE_OPENAI_SWISS_ENDPOINT,
    azure_openai_4o_mini_swiss_name: VALID_ENV_KEYS.AZURE_GPT_4O_MINI_SWISS_NAME
  }

  const isUsingEnvKeyMap = Object.keys(envKeyMap).reduce<
    Record<string, boolean>
  >((acc, provider) => {
    const key = envKeyMap[provider]

    if (key) {
      acc[provider] = isUsingEnvironmentKey(key as EnvKey)
    }
    return acc
  }, {})

  return createResponse({ isUsingEnvKeyMap }, 200)
}
