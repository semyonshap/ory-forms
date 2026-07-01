import { UiNodeInputHidden } from "../../types"

export function NodeInputHidden({ node }: { node: UiNodeInputHidden }) {
  return <input type="hidden" {...node.props} />
}
