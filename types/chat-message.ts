import { Tables } from "@/supabase/types"

export interface ChatMessage {
  role: any
  content: any
  message: Tables<"messages">
  fileItems: string[]
}
