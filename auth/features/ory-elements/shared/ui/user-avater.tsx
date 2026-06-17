// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ComponentPropsWithoutRef, forwardRef } from "react"
import { UserInitials } from "../util/user"
import { User as IconUser } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "../util/cn"

type UserAvatarProps = {
  initials: UserInitials
} & ComponentPropsWithoutRef<"button">

export const UserAvatar = forwardRef<HTMLButtonElement, UserAvatarProps>(
  ({ initials, className, disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className="relative"
        {...rest}
      >
        <Avatar className={cn("size-10", className)}>
          {initials.avatar && (
            <AvatarImage src={initials.avatar} alt={initials.primary} />
          )}
          <AvatarFallback>
            {initials.avatar ? (
              <IconUser className="size-4" />
            ) : (
              initials.primary.slice(0, 2).toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>
      </button>
    )
  },
)
UserAvatar.displayName = "UserAvatar"
