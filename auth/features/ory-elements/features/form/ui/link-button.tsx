// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeLabel } from "@ory/client-fetch"
import {
  OryNodeAnchorProps,
  uiTextToFormattedMessage,
} from "@/features/ory-elements"
import { forwardRef } from "react"
import { useIntl } from "react-intl"
import { cn } from "../../../shared/util/cn"
import { omitInputAttributes } from "../../../shared/util/omitAttributes"
import { Button } from "@/components/ui/button"

export const DefaultLinkButton = forwardRef<
  HTMLAnchorElement,
  OryNodeAnchorProps
>(({ attributes, node }, ref) => {
  const intl = useIntl()
  const label = getNodeLabel(node)
  return (
    <Button asChild>
      <a
        {...omitInputAttributes(attributes)}
        ref={ref}
        title={label ? uiTextToFormattedMessage(label, intl) : ""}
        data-testid={`ory/form/node/link/${attributes.id}`}
        className={cn("w-full")}
      >
        {label ? uiTextToFormattedMessage(label, intl) : ""}
      </a>
    </Button>
  )
})

DefaultLinkButton.displayName = "DefaultLinkButton"
