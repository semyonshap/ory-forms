import {
  OrySettingsWebauthnProps,
} from "../.."

import { Node } from "../../nodes"
import { omitInputAttributes } from "../../../shared/util/omitAttributes"
import { Key, Trash2 } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function DefaultSettingsWebauthn({
  nameInput,
  triggerButton,
  removeButtons,
  isSubmitting,
}: OrySettingsWebauthnProps) {
  const hasRemoveButtons = removeButtons.length > 0

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end md:max-w-96">
        <div className="flex-1">
          <Node.Input node={nameInput} />
        </div>
        {triggerButton ? <Node.Button node={triggerButton} /> : null}
      </div>
      {hasRemoveButtons ? (
        <div className="flex flex-col gap-8">
          <Separator />
          <div className="flex flex-col gap-4">
            {removeButtons.map((node, i) => {
              const context = node.meta.label?.context ?? {}
              const addedAt =
                "added_at" in context ? (context.added_at as string) : null
              const displayName =
                "display_name" in context
                  ? (context.display_name as string)
                  : null
              const keyId =
                "value" in node.attributes ? node.attributes.value : null

              return (
                <div
                  className="flex justify-between gap-6 md:items-center"
                  key={`webauthn-remove-button-${i}`}
                >
                  <div className="flex flex-1 items-center gap-2 truncate">
                    <Key
                      size={32}
                      className="text-interface-foreground-default-primary"
                    />
                    <div className="flex flex-1 flex-col gap-4 truncate md:flex-row md:items-center md:justify-between">
                      <div className="flex-1 flex-col truncate">
                        <p className="truncate text-sm font-medium text-interface-foreground-default-secondary">
                          {displayName}
                        </p>
                        <span className="hidden truncate text-sm text-interface-foreground-default-tertiary sm:block">
                          {keyId}
                        </span>
                      </div>
                      {addedAt && (
                        <p className="text-sm text-interface-foreground-default-tertiary">
                          {new Intl.DateTimeFormat(undefined, {
                            dateStyle: "long",
                          }).format(new Date(addedAt))}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    {...omitInputAttributes(node.attributes)}
                    type="submit"
                    onClick={node.buttonProps.onClick}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Spinner className="size-4" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
