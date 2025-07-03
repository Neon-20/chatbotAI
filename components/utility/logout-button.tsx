import { supabase } from "@/lib/supabase/browser-client"
import { IconLogout } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { FC } from "react"
import { SIDEBAR_ICON_SIZE } from "../sidebar/sidebar-switcher"
import { Button } from "../ui/button"
import { WithTooltip } from "../ui/with-tooltip"

interface LogoutButtonProps {}

export const LogoutButton: FC<LogoutButtonProps> = () => {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
    return
  }

  return (
    <WithTooltip
      display={<div>Logout</div>}
      trigger={
        <Button
          className="flex cursor-pointer space-x-2"
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
        >
          <IconLogout size={SIDEBAR_ICON_SIZE} />
        </Button>
      }
    />
  )
}
