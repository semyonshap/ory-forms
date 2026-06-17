// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryToastProps,
} from "@/features/ory-elements"
import { toast as sonnerToast } from "sonner"
import { useIntl } from "react-intl"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, X } from "lucide-react"
import { messageTestId, uiTextToFormattedMessage } from "../util"

export function DefaultToast({
  message,
  // Id can be used to close the toast later, but we don't use it here
  id,
}: OryToastProps) {
  const intl = useIntl()

  const title =
    message.type === "error"
      ? intl.formatMessage({ id: "settings.messages.toast-title.error" })
      : intl.formatMessage({ id: "settings.messages.toast-title.success" })
  const messageText = uiTextToFormattedMessage(message, intl)

  const Icon = message.type === "error" ? XCircle : CheckCircle

  return (
    <Alert
      variant={message.type === "error" ? "destructive" : "default"}
      className="relative"
      {...messageTestId(message)}
    >
      <Icon className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{messageText}</AlertDescription>
      <button
        data-testid={`ory/message/${message.id}.close`}
        className="absolute top-2 right-2 cursor-pointer text-muted-foreground hover:text-foreground"
        onClick={() => sonnerToast.dismiss(id)}
      >
        <X className="size-4" />
      </button>
    </Alert>
  )
}
