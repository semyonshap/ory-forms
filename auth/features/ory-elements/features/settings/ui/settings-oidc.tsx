import {
  OrySettingsSsoProps,
} from "../components"
import { useEffect } from "react"
import { useDebounceValue } from "usehooks-ts"
import { omitInputAttributes } from "../../../shared/util/omitAttributes"
import { Trash } from "lucide-react"
import logos from "../../../shared/lib/provider-logos"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { GenericLogo } from "../../form/ui/sso"
import { Button } from "@/components/ui/button"
import { UiNodeInput } from "@/features/ory-elements/shared/util"
import Image from "next/image"

export function extractProvider(
  context: object | undefined,
): string | undefined {
  if (
    context &&
    typeof context === "object" &&
    "provider" in context &&
    typeof context.provider === "string"
  ) {
    return context.provider
  }
  return undefined
}

export function DefaultSettingsOidc({
  linkButtons,
  unlinkButtons,
  isSubmitting,
}: OrySettingsSsoProps) {
  const hasLinkButtons = linkButtons.length > 0
  const hasUnlinkButtons = unlinkButtons.length > 0

  return (
    <div className="flex flex-col gap-8">
      {hasLinkButtons && (
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 md:grid-cols-3">
          {linkButtons.map((button) => {
            const provider = (button.attributes.value + "").split("-")[0]
            const Logo = logos[provider]
            return (
              <Button
                key={button.attributes.value}
                variant="outline"
                className="h-auto p-4 gap-3 justify-start"
                {...omitInputAttributes(button.attributes)}
                {...button.buttonProps}
                disabled={isSubmitting}
              >
                {Logo ? (
                  <Image src={Logo} width={20} height={20} alt={provider} />
                ) : (
                  <GenericLogo label={provider.slice(0, 1)} />
                )}
                <span className="text-sm">
                  {button.meta.label?.text || `Link ${provider}`}
                </span>
              </Button>
            )
          })}
        </div>
      )}
      {hasUnlinkButtons && hasLinkButtons ? <Separator /> : null}
      {unlinkButtons.map((button) => {
        if (button.attributes.node_type !== "input") {
          return null
        }
        return (
          <UnlinkRow
            key={button.attributes.value}
            button={button}
            isSubmitting={isSubmitting}
          />
        )
      })}
    </div>
  )
}

type UnlinkRowProps = {
  button: UiNodeInput & { onClick: () => void }
  isSubmitting: boolean
}

function UnlinkRow({ button, isSubmitting }: UnlinkRowProps) {
  // Safari cancels form submission events, if we do a state update in the same tick
  // so we delay the state update by 100ms
  const [clicked, setClicked] = useDebounceValue(false, 100)
  const provider = extractProvider(button.meta.label?.context) ?? ""
  const Logo = logos[(button.attributes.value as string).split("-")[0]]

  const localOnClick = () => {
    button.onClick()
    setClicked(true)
  }

  useEffect(() => {
    if (!isSubmitting) {
      setClicked(false)
    }
  }, [isSubmitting, setClicked])

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-6">
        {Logo ? (
          <Image src={Logo} width={32} height={32} alt={provider} />
        ) : (
          <GenericLogo label={provider.slice(0, 1)} />
        )}
        <p className="text-sm font-medium text-interface-foreground-default-secondary">
          {provider}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        {...omitInputAttributes(button.attributes)}
        type="submit"
        onClick={localOnClick}
        disabled={isSubmitting}
        title={`Unlink ${provider}`}
      >
        {clicked ? (
          <Spinner className="size-4" />
        ) : (
          <Trash className="size-4" />
        )}
      </Button>
    </div>
  )
}
