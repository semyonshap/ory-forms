import { ReactNode } from "react"
import { UiNodeDiv } from "../../types"

export function NodeDiv(
  startNode: UiNodeDiv,
  children: ReactNode[],
): ReactNode {
  return (
    <div
      key={startNode.attributes.id}
      className={startNode.attributes._class}
      data-testid={startNode.attributes.data?.testid}
    >
      {children}
    </div>
  )
}
