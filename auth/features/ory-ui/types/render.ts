import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"
import { omittedInputKeys, UiNodeInput } from "."
import { ComponentType, MouseEventHandler, PropsWithChildren } from "react"

type OmittedImageKeys = (typeof omittedInputKeys)[number]
type OmittedAnchorKeys = (typeof omittedInputKeys)[number]

type IconOption = ComponentType<{ size?: number }>

export type FormOptionsText = {
  label?: string
}

export type FormOptionsInput = FormOptionsText

export type FormOptionsButton = {
  label?: string
  icon?: IconOption
  isSubmitting: boolean
}

export type FormOptionsAuthMethodButton = {
  label?: string
  icon?: IconOption
  description?: string
}

export type FormImageProps = {
  renderAttributes: Omit<UiNodeImageAttributes, OmittedImageKeys>
}

export type FormInputProps = {
  id: string
  name: string
  value: string | number | readonly string[] | undefined

  onClick?: MouseEventHandler
  onChange?: (event: any) => void
  onBlur: () => void
  ref?: (instance: any) => void

  disabled?: boolean
  type: UiNodeInputAttributesTypeEnum
  maxLength?: number
  autoComplete?: string
  placeholder: string
}

export type FormInputHiddenProps = {
  name: string
  value: string | number | readonly string[] | undefined
  onChange: (event: any) => void
  onBlur: () => void
  ref?: (instance: any) => void
  id?: string
  disabled?: boolean
}

export type FormInputButtonProps = {
  name: string
  value: string | number | readonly string[] | undefined
  onClick: (event: any) => void

  disabled?: boolean
}

export type FormRenderButton = {
  node: UiNodeInput
  props: FormInputButtonProps
  options: FormOptionsButton
}

export type FormRenderInput = {
  node: UiNodeInput
  props: FormInputProps
  options: FormOptionsInput
}

export type FormRenderAuthMethodButton = {
  node: UiNodeInput
  props: FormInputButtonProps
  options: FormOptionsAuthMethodButton
}

export type FormRenderAnchor = {
  node: UiNode
  props: Omit<UiNodeAnchorAttributes, OmittedAnchorKeys>
  options: FormOptionsText
}

export type FormRenderImage = {
  node: UiNode
  props: Omit<UiNodeImageAttributes, OmittedImageKeys>
}

export type FormRenderSelect = {
  node: UiNode
}

export type FormRenderText = {
  node: UiNode
  options: {
    label?: string
    description?: string
  }
}

export type FooterAction =
  | { kind: "link"; label: string; href: string }
  | { kind: "button"; label: string; onClick?: MouseEventHandler }

export type CardRenderRoot = {
  header: {
    title?: string
    description?: string
  }
  nodes: React.ReactNode
  footer: React.ReactNode
}

export type CardRenderFooter = {
  captions?: string[]
  children?: React.ReactNode
}
