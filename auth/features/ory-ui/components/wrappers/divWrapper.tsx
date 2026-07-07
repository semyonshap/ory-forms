import { NodeDiv } from "../nodes/div"
import { NodeRenderDiv } from "../../types"
import { useFlowStore } from "../../context"
import { useDiv } from "../../hooks/useDiv"
import { renderNodes } from "../render"

export function DivWrapper({ node, attached }: NodeRenderDiv) {
  const Main = useFlowStore((state) => state.components.Main)

  const type = node.attributes.data?.type

  if (!type || type === "Div")
    return <NodeDiv node={node} attached={attached} />

  if (type === "DividerCard") {
    if (Main.DividerCard) return <Main.DividerCard node={node} />
    else return null
  }

  const { options } = useDiv(node)

  if (type === "FormCard") {
    return <Main.FormCard node={node} attached={attached} options={options} />
  }

  if (type === "SettingsCard" && Main.SettingsCard) {
    return (
      <Main.SettingsCard node={node} attached={attached} options={options} />
    )
  }

  return <NodeDiv node={node} attached={attached} />
}
