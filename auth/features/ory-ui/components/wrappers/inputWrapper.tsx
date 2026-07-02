import { UiNodeInput } from "../../types"
import { useFlowStore } from "../../context"
import { useButtonRenderProps, useInputRenderProps } from "../../hooks"

export function InputWrapper({ node }: { node: UiNodeInput }) {
  const Node = useFlowStore((state) => state.components.Node)

  const { options, props } = useInputRenderProps(node)

  if (props.type == "hidden") return <input {...props} />
  if (props.type == "password" && Node.Password)
    return <Node.Password node={node} props={props} options={options} />

  return <Node.Input node={node} props={props} options={options} />
}

export function ButtonWrapper({ node }: { node: UiNodeInput }) {
  const Node = useFlowStore((state) => state.components.Node)

  const { props, options } = useButtonRenderProps(node)
  return <Node.Button node={node} props={props} options={options} />
}

export function SsoButtonWrapper({ node }: { node: UiNodeInput }) {
  const Node = useFlowStore((state) => state.components.Node)

  const { props, options } = useButtonRenderProps(node)
  const Component = Node.SsoButton ? Node.SsoButton : Node.Button
  return <Component node={node} props={props} options={options} />
}

export function SubmitButtonWrapper({ node }: { node: UiNodeInput }) {
  const Node = useFlowStore((state) => state.components.Node)

  const { props, options } = useButtonRenderProps(node)
  const Component = Node.SubmitButton ? Node.SubmitButton : Node.Button
  return <Component node={node} props={props} options={options} />
}

export function MethodButtonWrapper({ node }: { node: UiNodeInput }) {
  const Node = useFlowStore((state) => state.components.Node)

  const { props, options } = useButtonRenderProps(node)
  const Component = Node.SsoButton ? Node.SsoButton : Node.Button
  return <Component node={node} props={props} options={options} />
}

export function CodeWrapper({ node }: { node: UiNodeInput }) {
  const Node = useFlowStore((state) => state.components.Node)
  const { props, options } = useInputRenderProps(node)

  return <Node.Code node={node} props={props} options={options} />
}
