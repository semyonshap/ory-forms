import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { OryCard, OryCardContent, OryCardFooter } from ".."
import { useComponents, useNodeSorter } from "../../../../context"
import { isNodeVisible, withoutSingleSignOnNodes } from "../../../../shared/util/ui"
import { OryForm } from "../../../form/components/form"
import { OryCardValidationMessages } from "../../../form/components/messages"
import { Node } from "../../../nodes/components/node"
import { OryFormSsoForm } from "../../../form/components/social"
import { handleAfterFormSubmit } from "./utils"
import { OryCardHeader } from "../header"
import { useOryFlow } from "../../../flows"

export function ProvideIdentifierForm() {
  const { Form, Card } = useComponents()
  const { flowType, flow, dispatchFormState } = useOryFlow()

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  const nonSsoNodes = withoutSingleSignOnNodes(flow.ui.nodes).sort(sortNodes)
  const hasSso = flow.ui.nodes
    .filter(isNodeVisible)
    .some(
      (node) =>
        node.group === UiNodeGroupEnum.Oidc ||
        node.group === UiNodeGroupEnum.Saml,
    )
  const showSsoDivider = hasSso && nonSsoNodes.some(isNodeVisible)

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        <OryFormSsoForm />
        <OryForm onAfterSubmit={handleAfterFormSubmit(dispatchFormState)}>
          <Form.Group>
            {showSsoDivider && <Card.Divider />}
            {nonSsoNodes.map((node, k) => (
              <Node node={node} key={k} />
            ))}
          </Form.Group>
        </OryForm>
      </OryCardContent>
      <OryCardFooter />
    </OryCard>
  )
}
