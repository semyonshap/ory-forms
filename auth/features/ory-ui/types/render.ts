import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributesTypeEnum,
  UiTextTypeEnum,
} from "@ory/client-fetch"
import {
  FormNode,
  FormState,
  omittedInputKeys,
  OryConfiguration,
  OryFlowContainer,
  UiNodeAnchor,
  UiNodeImage,
  UiNodeInput,
  UiNodeText,
} from "."
import { MouseEventHandler, PropsWithChildren, ReactNode } from "react"
import { TFunction } from "i18next"

export type InputDataType =
  | "default"
  | "link"
  | "submit"
  | "cancel"
  | "sso"
  | "method"

export type MessageProps = {
  id: number
  text: string
  type: UiTextTypeEnum
}

export type BaseRenderProps = {
  attached?: ReactNode
}

export type FormRenderButton = BaseRenderProps & {
  node: UiNodeInput
  props: {
    name: string
    value: string | number | readonly string[] | undefined
    onClick: (event: any) => void
    disabled?: boolean
  }
  options: {
    type?: InputDataType
    label?: string
    description?: string
    icon?: IconType
    isSubmitting?: boolean
  }
}

export type FormRenderInput = BaseRenderProps & {
  node: UiNodeInput
  props: {
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
}

type OmittedAnchorKeys = (typeof omittedInputKeys)[number]
export type FormRenderAnchorProps = BaseRenderProps & {
  node: UiNode
  props: Omit<UiNodeAnchorAttributes, OmittedAnchorKeys>
  options: {
    label?: string
  }
}

type OmittedImageKeys = (typeof omittedInputKeys)[number]
export type FormRenderImageProps = BaseRenderProps & {
  node: UiNode
  props: Omit<UiNodeImageAttributes, OmittedImageKeys>
}

export type FormRenderSelect = BaseRenderProps & {
  node: UiNode
}

export type FormRenderLabelProps = BaseRenderProps & {
  node: UiNodeInput
  options: {
    label?: string
    messages?: MessageProps[]
  }
} & PropsWithChildren

export type FormRenderTextProps = BaseRenderProps & {
  node: UiNode
  options: {
    label?: string
    text?: string
  }
}

export type FormRenderCardProps = {
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

export type FormContext = Partial<Record<string, React.ReactNode[]>>

export type Attached = {
  attached?: ReactNode
}

export type NodeRender = {
  node: FormNode
} & Attached

export type NodeRenderInput = {
  node: UiNodeInput
} & Attached

export type NodeRenderImage = {
  node: UiNodeImage
} & Attached

export type NodeRenderAnchor = {
  node: UiNodeAnchor
} & Attached

export type NodeRenderText = {
  node: UiNodeText
} & Attached

export interface BuildContext {
  config: OryConfiguration
  container: OryFlowContainer
  formState: FormState
  t: TFunction
}
