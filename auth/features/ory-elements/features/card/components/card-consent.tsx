import { useComponents } from "../../../context"
import { useOryFlow } from "../../flows"
import { OryForm } from "../../form/components"
import { Node } from "../../nodes/components/node"
import { OryCard } from "./card"
import { OryCardContent } from "./content"
import { OryCardFooter } from "./footer"
import { OryCardHeader } from "./header"
import { getNodeId } from "@ory/client-fetch"

/**
 * The `OryConsentCard` component renders a card for displaying the OAuth2 consent flow.
 *
 * @returns The consent card component.
 * @group Components
 */
export function OryConsentCard() {
  const { Form, Card } = useComponents()
  const flow = useOryFlow()
  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryForm>
          <Card.Divider />
          <Form.Group>
            {flow.flow.ui.nodes.map((node) => (
              <Node key={getNodeId(node)} node={node} />
            ))}
          </Form.Group>
          <Card.Divider />
          <OryCardFooter />
        </OryForm>
      </OryCardContent>
    </OryCard>
  )
}
