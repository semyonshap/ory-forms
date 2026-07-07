import { ReactNode } from "react"
import { FormRenderDivProps } from "../../types"

export function NodeDiv({ node, attached }: FormRenderDivProps): ReactNode {
  return (
    <div
      key={node.attributes.id}
      className={node.attributes._class}
      data-testid={node.attributes.data?.testid}
    >
      {attached}
    </div>
  )
}
