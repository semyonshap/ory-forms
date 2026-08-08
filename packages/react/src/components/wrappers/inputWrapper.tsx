import { ComponentType } from 'react'

import { BlockButton, WrapperCaptcha, WrapperInput } from '../../types'
import { useButton, useInput, useCheckbox, useCaptcha } from '../../hooks'
import {
  useStoreClient,
  useFlowStore,
  useFlowStoreShallow,
} from '../../context'

export function InputWrapper({ node, children, attached }: WrapperInput) {
  const store = useStoreClient()

  const { Node } = useFlowStoreShallow((state) => ({
    Node: state.components.Node,
  }))

  const { options, props } = useInput(node)
  if (props.type == 'hidden') return <input {...props} />

  const attr = node.attributes
  const isPinCodeInput =
    (attr.name === 'code' && node.group === 'code') ||
    (attr.name === 'totp_code' && node.group === 'totp')

  let Component = Node.Input
  if (isPinCodeInput && Node.Code) Component = Node.Code
  else if (props.type === 'password' && Node.Password)
    Component = Node.Password

  return (
    <Node.Label
      node={node}
      options={options}
      store={store}
      attached={attached}
    >
      <Component
        node={node}
        props={props}
        options={options}
        store={store}
        attached={attached}
      >
        {children}
      </Component>
    </Node.Label>
  )
}

export function ButtonWrapper({ node, children, attached }: WrapperInput) {
  const store = useStoreClient()

  const Node = useFlowStore((state) => state.components.Node)

  const { props, options } = useButton(node)

  let Component: ComponentType<BlockButton> = Node.Button

  const variant = node.data?.variant

  if (variant === 'method' && Node.AuthMethod) Component = Node.AuthMethod
  else if (variant === 'resend' && Node.Resend) Component = Node.Resend
  else if (variant === 'oidc' && Node.Oidc) Component = Node.Oidc

  return (
    <Component
      node={node}
      props={props}
      options={options}
      store={store}
      attached={attached}
    >
      {children}
    </Component>
  )
}

export function CheckboxWrapper({
  node,
  children,
  attached,
}: WrapperInput) {
  const store = useStoreClient()

  const Node = useFlowStore((state) => state.components.Node)

  const { options, props } = useCheckbox(node)

  return (
    <Node.Checkbox
      node={node}
      props={props}
      options={options}
      store={store}
      attached={attached}
    >
      {children}
    </Node.Checkbox>
  )
}

export function CaptchaWrapper({
  node,
  children,
  attached,
}: WrapperCaptcha) {
  const store = useStoreClient()

  const { Node } = useFlowStoreShallow((state) => ({
    Node: state.components.Node,
  }))

  const { options } = useCaptcha(node)

  if (!Node.Captcha) return null

  return (
    <Node.Captcha
      node={node}
      options={options}
      store={store}
      attached={attached}
    >
      {children}
    </Node.Captcha>
  )
}
