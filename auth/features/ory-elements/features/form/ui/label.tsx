// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  getNodeLabel,
  instanceOfUiText,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import {
  messageTestId,
  OryNodeLabelProps,
  useComponents,
  useOryConfiguration,
  useOryFlow,
  useResendCode,
} from "@/features/ory-elements"
import { useMemo } from "react"
import { useIntl } from "react-intl"
import { resolveLabel } from "../../../shared/util/nodes"
import { initFlowUrl } from "../../../shared/util/url"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function DefaultLabel({
  node,
  children,
  attributes,
  fieldError,
}: OryNodeLabelProps) {
  const intl = useIntl()
  const label = getNodeLabel(node)
  const { Message } = useComponents()
  const { resendCode, resendCodeNode } = useResendCode()

  return (
    <div className="flex flex-col gap-1 antialiased">
      {label && (
        <span className="inline-flex justify-between">
					<Label
							{...messageTestId(label)}
							className="leading-normal text-muted-foreground"
							htmlFor={attributes.name}
							data-testid={`ory/form/node/input/label/${attributes.name}`}
						>
							{resolveLabel(label, intl)}
						</Label>
						<LabelAction attributes={attributes} />
						{resendCodeNode?.attributes.node_type === "input" && (
							<Button
								variant="link"
								size="sm"
								type="button"
								name={resendCodeNode.attributes.name}
								value={resendCodeNode.attributes.value}
								onClick={resendCode}
								className="p-0 h-auto"
							>
								{intl.formatMessage({ id: "identities.messages.1070008" })}
							</Button>
						)}
        </span>
      )}
      {children}
      {node.messages.map((message) => (
        <Message.Content key={message.id} message={message} />
      ))}
      {fieldError && instanceOfUiText(fieldError) && (
        <Message.Content message={fieldError} />
      )}
    </div>
  )
}

type LabelActionProps = {
  attributes: UiNodeInputAttributes
}

function LabelAction({ attributes }: LabelActionProps) {
  const intl = useIntl()
  const { flowType, flow, formState } = useOryFlow()
  const config = useOryConfiguration()

  const action = useMemo(() => {
    if (flowType === FlowType.Login && config.project.recovery_enabled) {
      if (formState.current === "provide_identifier" && !flow.refresh) {
        if (attributes.name === "identifier") {
          return {
            message: intl.formatMessage({
              id: "forms.label.recover-account",
              defaultMessage: "Recover Account",
            }),
            href: initFlowUrl(config.sdk.url, "recovery", flow),
            testId: "recover-account",
          }
        }
      } else if (attributes.type === "password") {
        return {
          message: intl.formatMessage({
            id: "forms.label.forgot-password",
            defaultMessage: "Forgot password?",
          }),
          href: initFlowUrl(config.sdk.url, "recovery", flow),
          testId: "forgot-password",
        }
      }
    }
  }, [
    attributes,
    config.project.recovery_enabled,
    flow,
    flowType,
    intl,
    config.sdk.url,
    formState,
  ])

  return action ? (
    <a
      href={action.href}
      className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
      data-testid={`ory/screen/login/action/${action.testId}`}
    >
      {action.message}
    </a>
  ) : null
}
