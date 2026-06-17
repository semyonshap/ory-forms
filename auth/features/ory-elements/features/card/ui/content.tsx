import { OryCardContentProps } from "@/features/ory-elements"

/**
 * Simply renders the children passed to it.
 *
 * @param props - pass children to render instead of the default Ory Card components
 * @returns
 * @group Components
 * @category Default Components
 */
export function DefaultCardContent({ children }: OryCardContentProps) {
  return children
}
