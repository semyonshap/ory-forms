// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps, forwardRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "../../../shared/util/cn"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type PasswordInputProps = ComponentProps<"input">

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, type, ...props }, ref) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    )
  },
)

PasswordInput.displayName = "PasswordInput"
