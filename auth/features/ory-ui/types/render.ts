import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributesTypeEnum,
  UiTextTypeEnum,
} from "@ory/client-fetch"
import { FormContext, omittedInputKeys, UiNodeInput } from "."
import { MouseEventHandler, PropsWithChildren } from "react"

type OmittedImageKeys = (typeof omittedInputKeys)[number]
type OmittedAnchorKeys = (typeof omittedInputKeys)[number]

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

export type ButtonOptionType = "default" | "link" | "submit" | "cancel" | "sso"

export type MessageProps = {
  id: number
  text: string
  type: UiTextTypeEnum
}

export type BaseRenderProps = {
  context?: FormContext
}

export type FormRenderButton = BaseRenderProps & {
  node: UiNodeInput
  props: FormInputButtonProps
  options: {
    type?: ButtonOptionType
    label?: string
    icon?: IconType
    isSubmitting?: boolean
  }
}

export type FormRenderInput = BaseRenderProps & {
  node: UiNodeInput
  props: FormInputProps
}

export type FormRenderMethodButton = BaseRenderProps & {
  node: UiNodeInput
  props: FormInputButtonProps
  options: {
    label?: string
    icon?: IconType
    description?: string
  }
}

export type FormRenderAnchor = BaseRenderProps & {
  node: UiNode
  props: Omit<UiNodeAnchorAttributes, OmittedAnchorKeys>
  options: {
    label?: string
  }
}

export type FormRenderImage = BaseRenderProps & {
  node: UiNode
  props: Omit<UiNodeImageAttributes, OmittedImageKeys>
}

export type FormRenderSelect = BaseRenderProps & {
  node: UiNode
}

export type FormRenderLabel = BaseRenderProps & {
  node: UiNodeInput
  options: {
    label?: string
    messages?: MessageProps[]
  }
} & PropsWithChildren

export type FormRenderText = BaseRenderProps & {
  node: UiNode
  options: {
    label?: string
    text?: string
  }
}

export type CardRenderRoot = {
  header: {
    title?: string
    description?: string
  }
  nodes: React.ReactNode[]
  messages?: MessageProps[]
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export type IconType = React.ComponentType<IconProps>
