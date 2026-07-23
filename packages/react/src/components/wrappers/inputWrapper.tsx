import { ComponentType } from "react"

import { useButton, useInput } from "../../hooks"
import { useCheckbox } from "../../hooks"
import { FormRenderButton, NodeRenderInput } from "../../types"
import { useFlowStore, useFlowStoreShallow } from "../../context"

export function InputWrapper({ node, attached }: NodeRenderInput) {
  const { Node } = useFlowStoreShallow((state) => ({
    Node: state.components.Node,
  }))

  const { options, props } = useInput(node)
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

  const { props, options } = useButton(node)

  let Component: ComponentType<FormRenderButton>

  const type = node.data?.type

  if (type === "method" && Node.AuthMethod) Component = Node.AuthMethod
  else if (type === "resend" && Node.Resend) Component = Node.Resend
  else if (type === "oidc" && Node.Oidc) Component = Node.Oidc
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

export function CheckboxWrapper({ node, attached }: NodeRenderInput) {
  const Node = useFlowStore((state) => state.components.Node)

  const { options, props } = useCheckbox(node)

  return (
    <Node.Checkbox
      node={node}
      attached={attached}
      props={props}
      options={options}
    />
  )
}
