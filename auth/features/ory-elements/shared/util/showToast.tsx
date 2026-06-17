// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { toast as sonnerToast } from "sonner"
import { OryToastProps } from "../../features"

export function showToast(
  toast: Omit<OryToastProps, "id">,
  ToastComponent?: React.ComponentType<OryToastProps>,
) {
  // If ToastComponent is provided, use it (for backward compatibility)
  if (ToastComponent) {
    return sonnerToast.custom((id) => (
      <ToastComponent id={id} message={toast.message} />
    ))
  }

  // Otherwise, use sonner directly
  const messageText = toast.message.text || toast.message.id || "Message"

  if (toast.message.type === "error") {
    sonnerToast.error(messageText)
  } else if (toast.message.type === "success") {
    sonnerToast.success(messageText)
  } else {
    sonnerToast(messageText)
  }
}
