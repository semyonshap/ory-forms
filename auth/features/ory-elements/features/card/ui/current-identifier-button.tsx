import {
  FlowType,
  isUiNodeInputAttributes,
  UiNode,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import { useOryConfiguration } from "../../../context"
import { useOryFlow } from "../../flows"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { findScreenSelectionButton } from "../../../shared/util/nodes"
import { omitInputAttributes } from "../../../shared/util/omitAttributes"
import { ArrowLeft as IconArrowLeft } from "lucide-react"
import { restartFlowUrl } from "../../../shared/util/url"
import { Button } from "@/components/ui/button"

/**
 * The `DefaultCurrentIdentifierButton` component renders a button that displays the current identifier
 *
 * The button can be used to restart the flow with the current identifier if appropriate.
 *
 * @returns
 * @group Components
 * @category Default Components
 */
export function DefaultCurrentIdentifierButton() {
  const { flow, flowType, formState } = useOryFlow()
  const { setValue, getValues, watch } = useFormContext()
  const [turnstileResponse, setTurnstileResponse] = useState<
    string | undefined
  >()
  const config = useOryConfiguration()
  const ui = flow.ui

  // This workaround ensures that the screen/back button functions correctly. Without it, the button does not work as expected.
  // The `captcha_turnstile_response` value cannot be accessed directly via `transient_payload.captcha_turnstile_response`
  // in the form context, likely due to the way React Hook Form manages its internal state and transient payloads.
  // By using the `watch` function, we can observe changes to the `transient_payload` and retrieve the captcha response value.
  const captchaVerificationValue = watch("transient_payload")
    ?.captcha_turnstile_response as string | undefined
  useEffect(() => {
    if (captchaVerificationValue) {
      setTurnstileResponse(captchaVerificationValue)
    }
  }, [captchaVerificationValue])

  if (formState.current === "provide_identifier") {
    return null
  }

  if (
    flowType === FlowType.Login &&
    (flow.requested_aal === "aal2" || flow.refresh)
  ) {
    return null
  }

  const nodeBackButton = getBackButtonNodeAttributes(flowType, ui.nodes)
  if (!nodeBackButton) {
    return null
  }

  const initFlowUrl = restartFlowUrl(
    flow,
    `${config.sdk.url}/self-service/${flowType}/browser`,
  )

  const screenSelectionNode = findScreenSelectionButton(flow.ui.nodes)
  if (screenSelectionNode) {
    // This is bad and needs refactoring. Instead of a custom form, it should use react-hook-form
    // to submit the values so we don't have to creat a fake form with fake submit values. It
    // also hard-reloads the flow and we need the ugly captcha workaround.
    return (
      <form action={flow.ui.action} method={flow.ui.method}>
        {flow.ui.nodes
          .filter((n) => {
            if (isUiNodeInputAttributes(n.attributes)) {
              return (
                n.attributes.type === "hidden" &&
                ["default", "captcha"].includes(n.group)
              )
            }
            return false
          })
          .map((n: UiNode) => {
            const attrs = n.attributes as UiNodeInputAttributes
            let value = getValues(attrs.name) || attrs.value

            // Of course turnstile works a bit differently because it uses transient_payload
            // to carry over information. So yeah, we need a special decode here.
            if (
              attrs.name === "transient_payload.captcha_turnstile_response" &&
              turnstileResponse
            ) {
              value = turnstileResponse
            }

            return (
              <input
                key={attrs.name}
                type="hidden"
                name={attrs.name}
                value={value}
              />
            )
          })}
        <Button
          variant="outline"
          size="sm"
          className="gap-2 w-fit"
          {...omitInputAttributes(nodeBackButton)}
          type={"submit"}
          onClick={() => {
            setValue(
              screenSelectionNode.attributes.name,
              screenSelectionNode.attributes.value,
            )
            setValue("method", "profile")
          }}
          name={screenSelectionNode.attributes.name}
          value={screenSelectionNode.attributes.value}
          title={
            nodeBackButton.value ? `Adjust ${nodeBackButton.value}` : `Back`
          }
          data-testid={`ory/screen/${flowType}/action/restart`}
          asChild={false}
        >
          <IconArrowLeft size={16} />
          {nodeBackButton.value ? nodeBackButton.value : "Back"}
        </Button>
      </form>
    )
  }

  return (
    <Button asChild variant="outline" size="sm" className="gap-2 w-fit">
      <a
        {...omitInputAttributes(nodeBackButton)}
        href={initFlowUrl}
        title={`Adjust ${nodeBackButton?.value}`}
        data-testid={`ory/screen/${flowType}/action/restart`}
      >
        <IconArrowLeft size={16} />
        {nodeBackButton?.value}
      </a>
    </Button>
  )
}

export function getBackButtonNodeAttributes(
  flowType: FlowType,
  nodes: UiNode[],
): UiNodeInputAttributes | undefined {
  let nodeBackButtonAttributes: UiNodeInputAttributes | undefined
  switch (flowType) {
    case FlowType.Login:
      nodeBackButtonAttributes = nodes.find(
        (node) =>
          isUiNodeInputAttributes(node.attributes) &&
          node.attributes.name === "identifier" &&
          ["default", "identifier_first"].includes(node.group),
      )?.attributes as UiNodeInputAttributes | undefined
      break
    case FlowType.Registration:
      nodeBackButtonAttributes = guessRegistrationBackButton(nodes)
      break
    case FlowType.Recovery:
      nodeBackButtonAttributes = nodes.find(
        (n) =>
          isUiNodeInputAttributes(n.attributes) &&
          !!n.attributes.value &&
          ["email", "recovery_confirm_address", "recovery_address"].includes(
            n.attributes.name,
          ),
      )?.attributes as UiNodeInputAttributes | undefined
      break
    case FlowType.Verification:
      // Re-use the email node for displaying the email
      nodeBackButtonAttributes = nodes.find(
        (n) =>
          isUiNodeInputAttributes(n.attributes) &&
          n.attributes.name === "email",
      )?.attributes as UiNodeInputAttributes | undefined
      break
  }

  if (
    nodeBackButtonAttributes?.node_type !== "input" ||
    !nodeBackButtonAttributes?.value
  ) {
    return undefined
  }

  return nodeBackButtonAttributes
}

const backButtonCandiates = [
  "traits.email",
  "traits.username",
  "traits.phone_number",
]

/**
 * Guesses the back button for registration flows
 *
 * This is based on the list above, and the first node that matches the criteria is returned.
 *
 * The list is most likely not exhaustive yet, and may need to be updated in the future.
 *
 */
export function guessRegistrationBackButton(
  uiNodes: UiNode[],
): UiNodeInputAttributes | undefined {
  return uiNodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      backButtonCandiates.includes(node.attributes.name) &&
      node.group === "default",
  )?.attributes as UiNodeInputAttributes | undefined
}
