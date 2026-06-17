import { UiNodeInputAttributes } from "@ory/client-fetch"
import { OrySettingsTotpProps } from "../.."
import {
  UiNodeImage,
  UiNodeInput,
  UiNodeText,
} from "../../../shared/util/utilFixSDKTypesHelper"
import { Node } from "../../nodes"
import { QrCode, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

export function DefaultSettingsTotp({
  totpImage,
  totpInput,
  totpSecret,
  totpUnlink,
  onUnlink,
  isSubmitting,
}: OrySettingsTotpProps) {
  if (totpUnlink) {
    return (
      <SettingsTotpUnlink
        totpUnlinkAttributes={totpUnlink.attributes}
        onUnlink={onUnlink}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (totpImage && totpSecret && totpInput) {
    return (
      <SettingsTotpLink
        totpImage={totpImage}
        totpSecret={totpSecret}
        totpInput={totpInput}
      />
    )
  }
}

type SettingsTotpUnlinkProps = {
  totpUnlinkAttributes: UiNodeInputAttributes
  onUnlink: () => void
  isSubmitting: boolean
}

function SettingsTotpUnlink({
  totpUnlinkAttributes,
  onUnlink,
  isSubmitting,
}: SettingsTotpUnlinkProps) {
  const {
    type,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autocomplete: _ignoredAutocomplete,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    label: _ignoredLabel,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    node_type: _ignoredNodeType,
    ...buttonAttrs
  } = totpUnlinkAttributes

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="col-span-full">
        <Separator />
      </div>
      <div className="col-span-full flex items-center gap-6">
        <div className="aspect-square size-8">
          <QrCode size={32} />
        </div>
        <div className="mr-auto flex flex-col">
          <p className="text-sm font-medium text-interface-foreground-default-primary">
            Authenticator app
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          type={type === "button" ? "button" : "submit"}
          {...buttonAttrs}
          onClick={onUnlink}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner className="size-4" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

type SettingsTotpLinkProps = {
  totpImage: UiNodeImage
  totpSecret: UiNodeText
  totpInput: UiNodeInput
}

function SettingsTotpLink({
  totpImage,
  totpSecret,
  totpInput,
}: SettingsTotpLinkProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="col-span-full">
        <Separator />
      </div>
      <div className="flex justify-center rounded-cards bg-interface-background-default-secondary p-8">
        <div className="aspect-square h-44 invert">
          <div className="-m-3 antialiased mix-blend-multiply">
            <Node node={totpImage} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Node node={totpSecret} />
        <Node node={totpInput} />
      </div>
    </div>
  )
}
