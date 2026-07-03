import { UiNodeInputContext } from "../../types"
import { useFlowStore, useFlowStoreShallow } from "../../context"
import { useButtonRenderProps, useInputRenderProps } from "../../hooks"

export function InputWrapper({ node, context }: UiNodeInputContext) {
  const { Node } = useFlowStoreShallow((state) => ({
    Node: state.components.Node,
  }))

  const { options, props } = useInputRenderProps(node)
  if (props.type == "hidden") return <input {...props} />

  const attr = node.attributes
  const isPinCodeInput =
    (attr.name === "code" && node.group === "code") ||
    (attr.name === "totp_code" && node.group === "totp")

  let Component = Node.Input
  if (isPinCodeInput && Node.Code) Component = Node.Code
  else if (props.type === "password" && Node.Password) Component = Node.Password

  return (
    <Node.Label node={node} options={options} context={context}>
      <Component node={node} props={props} />
    </Node.Label>
  )
}

export function ButtonWrapper({ node, context }: UiNodeInputContext) {
  const Node = useFlowStore((state) => state.components.Node)

  const { props, options } = useButtonRenderProps(node)

  return (
    <Node.Button
      node={node}
      props={props}
      options={options}
      context={context}
    />
  )
}

export function MethodButtonWrapper({ node, context }: UiNodeInputContext) {
  const Node = useFlowStore((state) => state.components.Node)

  const { props, options } = useButtonRenderProps(node)
  const Component = Node.MethodButton ? Node.MethodButton : Node.Button
  return (
    <Component node={node} props={props} options={options} context={context} />
  )
}
