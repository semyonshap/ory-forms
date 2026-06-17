import { useComponents } from "../../../context"

export type OryCardFooterProps = Record<string, never>

/**
 *
 * @returns The footer of a card component.
 * @group Components
 */
export function OryCardFooter() {
  const { Card } = useComponents()
  return <Card.Footer />
}
