import { FormRenderButton, NodeRenderInput } from "../../types"
import { useFlowStore, useFlowStoreShallow } from "../../context"
import { useButtonRenderProps, useInputRenderProps } from "../../hooks"
import { ComponentType } from "react"

export function InputWrapper({ node, attached }: NodeRenderInput) {
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
    <Node.Label node={node} options={options} attached={attached}>
      <Component node={node} props={props} attached={attached} />
    </Node.Label>
  )
}

export function ButtonWrapper({ node, attached }: NodeRenderInput) {
  const Node = useFlowStore((state) => state.components.Node)

  const { props, options } = useButtonRenderProps(node)

  let Component: ComponentType<FormRenderButton>

  if (node.data?.type === "method" && Node.AuthMethod)
    Component = Node.AuthMethod
  else if (node.data?.type === "resend" && Node.Resend) Component = Node.Resend
  else Component = Node.Button

  return (
    <Component
      node={node}
      props={props}
      options={options}
      attached={attached}
    />
  )
}
