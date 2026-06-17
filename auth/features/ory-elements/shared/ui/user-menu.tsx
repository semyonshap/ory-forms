// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LogoutFlow, Session } from "@ory/client-fetch"
import { useOryConfiguration } from "@/features/ory-elements"
import { LogOut as IconLogout, Settings as IconSettings } from "lucide-react"
import { useClientLogout } from "../hooks/logout"
import { getUserInitials } from "../util/user"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "./user-avater"

type UserMenuProps = {
  session: Session | null
  logoutFlow?: LogoutFlow
}

export const UserMenu = ({ session }: UserMenuProps) => {
  const config = useOryConfiguration()
  const initials = getUserInitials(session)
  const { logoutFlow } = useClientLogout(config)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar initials={initials} title="User Menu" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex gap-3 px-5 py-4.5">
          <UserAvatar disabled initials={initials} />
          <div className="flex flex-col justify-center text-sm leading-tight">
            <div className="leading-tight font-medium text-interface-foreground-default-primary">
              {initials.primary}
            </div>
            {initials.secondary && (
              <div className="leading-tight text-interface-foreground-default-tertiary">
                {initials.secondary}
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem asChild className="px-4 py-2 gap-4">
          <a href={config.project.settings_ui_url}>
            <IconSettings className="size-4" /> User settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled={!logoutFlow?.logout_url} className="px-4 py-2 gap-4">
          <a href={logoutFlow?.logout_url}>
            <IconLogout className="size-4" /> Logout
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
