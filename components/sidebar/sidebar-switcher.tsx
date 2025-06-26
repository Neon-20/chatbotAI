import { ChatbotUIContext } from "@/context/context"
import { ContentType } from "@/types"
import {
  IconBooks,
  IconChartBar,
  IconCrown,
  IconFile,
  IconMessage,
  IconPencil,
  IconRobotFace,
  IconPalette
} from "@tabler/icons-react"
import { FC, useContext } from "react"
import AdminRolesSheet from "../AdminRolesSheet"
import { TabsList } from "../ui/tabs"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"
import { SidebarSwitchItem } from "./sidebar-switch-item"
import { Button } from "../ui/button"
import Link from "next/link"

export const SIDEBAR_ICON_SIZE = 28

interface SidebarSwitcherProps {
  onContentTypeChange: (contentType: ContentType) => void
}

export const SidebarSwitcher: FC<SidebarSwitcherProps> = ({
  onContentTypeChange
}) => {
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext)
  return (
    <div className="flex flex-col justify-between border-r-2 pb-5">
      <TabsList className="bg-background grid h-[480px] grid-rows-8">
        <SidebarSwitchItem
          icon={<IconMessage size={SIDEBAR_ICON_SIZE} />}
          contentType="chats"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          icon={<IconFile size={SIDEBAR_ICON_SIZE} />}
          contentType="files"
          onContentTypeChange={onContentTypeChange}
        />
        <SidebarSwitchItem
          icon={<IconPencil size={SIDEBAR_ICON_SIZE} />}
          contentType="prompts"
          onContentTypeChange={onContentTypeChange}
        />
        {profile?.roles != "user" &&
          selectedWorkspace?.user_id == profile?.user_id && (
            <SidebarSwitchItem
              icon={<IconBooks size={SIDEBAR_ICON_SIZE} />}
              contentType="collections"
              onContentTypeChange={onContentTypeChange}
            />
          )}
        {profile?.roles != "user" &&
          selectedWorkspace?.user_id == profile?.user_id && (
            <SidebarSwitchItem
              icon={<IconRobotFace size={SIDEBAR_ICON_SIZE} />}
              contentType="assistants"
              onContentTypeChange={onContentTypeChange}
            />
          )}

        {/* Canvas Design Tool */}
        <WithTooltip
          display={<div>Canvas Designer</div>}
          trigger={
            <Link href="/canvas" passHref>
              <Button variant={"ghost"}>
                <IconPalette size={28} />
              </Button>
            </Link>
          }
        />

        {(profile?.roles == "admin" || profile?.roles == "superadmin") && (
          // <AdminRolesSheet />
          <WithTooltip
            display={<div>Admin</div>}
            trigger={
              <Link href="/admin" passHref>
                <Button variant={"ghost"}>
                  <IconCrown size={28} />
                </Button>
              </Link>
            }
          />
        )}
        {profile?.roles == "superadmin" && (
          <WithTooltip
            display={<div>Analytics</div>}
            trigger={
              <Link href="/analytics" passHref>
                <Button variant={"ghost"}>
                  <IconChartBar />
                </Button>
              </Link>
            }
          />
        )}
      </TabsList>

      <div className="flex flex-col items-center space-y-4">
        {/* TODO */}
        {/* <WithTooltip display={<div>Import</div>} trigger={<Import />} /> */}

        {/* TODO */}
        {/* <Alerts /> */}

        <WithTooltip
          display={<div>Profile Settings</div>}
          trigger={<ProfileSettings />}
        />
      </div>
    </div>
  )
}
