import { NodeDiv } from "../nodes/div"
import { useDiv } from "../../hooks/useDiv"
import { NodeRenderDiv } from "../../types"
import { useFlowStore } from "../../context"

export function DivWrapper({ node, attached }: NodeRenderDiv) {
  const Main = useFlowStore((state) => state.components.Card)

  const type = node.attributes.data?.type

  if (!type || type === "Div")
    return <NodeDiv node={node} attached={attached} />

  if (type === "DividerCard") {
    if (Main.Divider) return <Main.Divider node={node} />
    else return null
  }

  const { options } = useDiv(node)

  if (type === "FormCard") {
    return <Main.Default node={node} attached={attached} options={options} />
  }

  if (type === "SettingsCard" && Main.Settings) {
    return <Main.Settings node={node} attached={attached} options={options} />
  }

  return <NodeDiv node={node} attached={attached} />
}
