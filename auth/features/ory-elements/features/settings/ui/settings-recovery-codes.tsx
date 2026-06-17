import { OrySettingsRecoveryCodesProps } from "@/features/ory-elements"
import { omitInputAttributes } from "../../../shared/util/omitAttributes"
import { Download, Eye, RefreshCw as Refresh } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export function DefaultSettingsRecoveryCodes({
  codes,
  regenerateButton,
  revealButton,
  onRegenerate,
  onReveal,
  isSubmitting,
}: OrySettingsRecoveryCodesProps) {
  const onDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([codes.join("\n")], {
      type: "text/plain",
    })
    element.href = URL.createObjectURL(file)
    element.download = "recovery-codes.txt"
    document.body.appendChild(element)
    element.click()
  }

  const hasCodes = codes.length >= 1

  return (
    <div className="flex flex-col gap-8">
      {codes.length > 0 && <Separator />}
      <div className="flex justify-between gap-4">
        <span className="text-interface-foreground-default-tertiary">
          {revealButton && "Reveal recovery codes"}
        </span>
        <div className="flex gap-2">
          {regenerateButton && codes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              {...omitInputAttributes(regenerateButton.attributes)}
              type="submit"
              onClick={onRegenerate}
              disabled={isSubmitting}
            >
              <Refresh className="size-4" />
            </Button>
          )}
          {revealButton && (
            <Button
              variant="ghost"
              size="sm"
              {...revealButton.attributes}
              type="submit"
              onClick={onReveal}
              title="Reveal recovery codes"
            >
              <Eye className="size-4" />
            </Button>
          )}
          {hasCodes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              type="button"
              data-testid="ory/screen/settings/group/recovery_code/download"
              title="Download recovery codes"
            >
              <Download className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {hasCodes ? (
        <div className="rounded-general border-interface-border-default-primary bg-interface-background-default-secondary p-6">
          <div
            className="grid grid-cols-2 flex-wrap gap-4 text-sm text-interface-foreground-default-primary sm:grid-cols-3 md:grid-cols-5"
            data-testid="ory/screen/settings/group/recovery_code/codes"
          >
            {codes.map((code) => (
              <p key={code}>{code}</p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
