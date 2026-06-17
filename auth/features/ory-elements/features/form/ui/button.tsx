// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeLabel } from "@ory/client-fetch"
import {
  OryNodeButtonProps,
  uiTextToFormattedMessage,
} from "@/features/ory-elements"
import { useIntl } from "react-intl"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"

export const DefaultButton = ({
  node,
  buttonProps,
  isSubmitting,
}: OryNodeButtonProps) => {
  const intl = useIntl()
  const label = getNodeLabel(node)

  const isPrimary = useMemo(() => {
    return (
      node.attributes.name === "method" ||
      node.attributes.name.includes("passkey") ||
      node.attributes.name.includes("webauthn") ||
      node.attributes.name.includes("lookup_secret") ||
      (node.attributes.name.includes("action") &&
        node.attributes.value === "accept")
    )
  }, [node.attributes.name, node.attributes.value])

  return (
    <Button
      {...buttonProps}
      data-testid={`ory/form/node/button/${node.attributes.name}`}
      data-loading={isSubmitting}
      variant={isPrimary ? "outline" : "outline"}
      className="relative flex cursor-pointer justify-center gap-3 overflow-hidden rounded-buttons leading-none max-w-[488px] p-4 disabled:cursor-not-allowed"
      disabled={isSubmitting}
    >
      {isSubmitting ? <Spinner /> : null}
      {label ? <span>{uiTextToFormattedMessage(label, intl)}</span> : ""}
    </Button>
  )
}

DefaultButton.displayName = "DefaultButton"
