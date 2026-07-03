import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { UiNodeInputAttributes, FlowType } from "@ory/client-fetch"
import { useFlowStoreShallow } from "../../context"
import { initFlowUrl } from "../../utils"

export function useLabelAction(attributes: UiNodeInputAttributes) {
  const { t } = useTranslation()
  const {
    config,
    flow: { flow, flowType },
    formState,
  } = useFlowStoreShallow((state) => ({
    config: state.config,
    flow: state.flowContainer,
    formState: state.formState,
  }))

  return useMemo(() => {
    if (
      flowType === FlowType.Login &&
      config.project.recovery_enabled &&
      !flow.refresh
    ) {
      if (formState.current === "provide_identifier") {
        if (attributes.name === "identifier") {
          return {
            message: t("forms.label.recover-account"),
            href: initFlowUrl(config.sdk.url, "recovery", flow),
            testId: "recover-account",
          }
        }
      } else if (attributes.type === "password") {
        return {
          message: t("forms.label.forgot-password"),
          href: initFlowUrl(config.sdk.url, "recovery", flow),
          testId: "forgot-password",
        }
      }
    }
    return null
  }, [
    attributes.name,
    attributes.type,
    flowType,
    config.project.recovery_enabled,
    formState.current,
    t,
    config.sdk.url,
    flow,
  ])
}
