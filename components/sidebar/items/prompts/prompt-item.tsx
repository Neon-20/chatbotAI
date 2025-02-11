import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TextareaAutosize } from "@/components/ui/textarea-autosize"
import { PROMPT_NAME_MAX } from "@/db/limits"
import { Tables } from "@/supabase/types"
import { IconPencil } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { SidebarItem } from "../all/sidebar-display-item"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { ChatbotUIContext } from "@/context/context"

interface PromptItemProps {
  prompt: Tables<"prompts">
}

export const PromptItem: FC<PromptItemProps> = ({ prompt }) => {
  const { profile } = useContext(ChatbotUIContext)
  const [name, setName] = useState(prompt.name)
  const [content, setContent] = useState(prompt.content)
  const [isPublic, setIsPublic] = useState(prompt.public)
  const [isTyping, setIsTyping] = useState(false)
  return (
    <SidebarItem
      item={prompt}
      isTyping={isTyping}
      contentType="prompts"
      icon={<IconPencil size={30} />}
      updateState={{ name, content, public: isPublic }}
      renderInputs={() => (
        <>
          <div className="space-y-1">
            <Label>Name</Label>

            <Input
              placeholder="Prompt name..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={PROMPT_NAME_MAX}
              onCompositionStart={() => setIsTyping(true)}
              onCompositionEnd={() => setIsTyping(false)}
              disabled={profile?.roles != "superadmin"}
            />
          </div>

          <div className="space-y-1">
            <Label>Prompt</Label>

            <TextareaAutosize
              placeholder="Prompt..."
              value={content}
              onValueChange={setContent}
              minRows={6}
              maxRows={20}
              onCompositionStart={() => setIsTyping(true)}
              onCompositionEnd={() => setIsTyping(false)}
              disabled={profile?.roles != "superadmin"}
            />
          </div>
          {profile?.roles === "superadmin" && (
            <div className="my-3 flex items-center space-x-2">
              <Label>Private</Label>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Switch checked={isPublic} id="public" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to change the visibility of this
                      prompt to {isPublic ? "private" : "public"}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Switching to {isPublic ? "private" : "public"} will make
                      the prompt accessible to
                      {isPublic ? " no-one" : " anyone"}, while setting it to{" "}
                      {!isPublic ? "private" : "public"} will{" "}
                      {isPublic
                        ? "make it available for everyone"
                        : "restrict access to only you"}
                      . This change can be undone at any time.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => setIsPublic(prev => !prev)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Label htmlFor="public">Public</Label>
            </div>
          )}
        </>
      )}
    />
  )
}
