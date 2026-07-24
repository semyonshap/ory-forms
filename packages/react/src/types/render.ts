import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributesTypeEnum,
  UiTextTypeEnum,
} from '@ory/client-fetch'
import { PropsWithChildren, ReactNode } from 'react'
import { TFunction } from 'i18next'
import { ControllerRenderProps, UseFormGetValues, UseFormSetValue } from 'react-hook-form'

import {
  FormNode,
  FormState,
  ButtonDataType,
  omittedInputKeys,
  OryConfiguration,
  OryFlowContainer,
  UiNodeAnchor,
  UiNodeImage,
  UiNodeInput,
  UiNodeText,
  UiNodeDiv,
  InputVariants,
  AnchorVariants,
  FormValues,
} from '.'

export interface MessageProps {
  id: number
  text: string
  type: UiTextTypeEnum
}

export interface BaseRenderProps {
  attached?: ReactNode
}

export type FormRenderButton = BaseRenderProps & {
  node: UiNodeInput
  props: {
    name: string
    value: string | number | readonly string[] | undefined
    onClick: (event: React.MouseEvent) => void
    disabled?: boolean
  }
  options: {
    type: InputVariants | ButtonDataType
    label?: string
    description?: string
    icon?: IconType
    isSubmitting?: boolean
  }
}

export type FormRenderCheckbox = BaseRenderProps & {
  node: UiNodeInput
  props: {
    checked: boolean
    onCheckedChange: (checked: boolean | 'indeterminate') => void
    disabled?: boolean
    onBlur?: () => void
    name?: string
    ref?: React.Ref<HTMLButtonElement>
  }
  options: {
    label?: string
    description?: string
    icon?: IconType
  }
}

export type InputProps = ControllerRenderProps & {
  id: string
  type: UiNodeInputAttributesTypeEnum
  placeholder: string
  maxLength?: number
  autoComplete?: string
  readOnly?: boolean
}

export type InputOptions = { label: string }

export type FormRenderInput = BaseRenderProps & {
  node: UiNodeInput
  props: InputProps
  options: InputOptions
}

type OmittedAnchorKeys = (typeof omittedInputKeys)[number]
export type FormRenderAnchorProps = BaseRenderProps & {
  node: UiNode
  props: Omit<UiNodeAnchorAttributes, OmittedAnchorKeys>
  options: {
    variant: AnchorVariants
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
  node: UiNodeText
  options: {
    label?: string
    text?: string
  }
}

export type FormRenderDivProps = BaseRenderProps & {
  node: UiNodeDiv
}

export interface FormRenderCardDivider {
  node: UiNodeDiv
}

export type FormRenderCardProps = FormRenderDivProps & {
  options: {
    title?: string
    description?: string
    messages?: MessageProps[]
  }
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export type IconType = React.ComponentType<IconProps>

export type FormContext = Partial<Record<string, React.ReactNode[]>>

export interface Attached {
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

export type NodeRenderDiv = {
  node: UiNodeDiv
} & Attached

export interface BuildContext {
  config: OryConfiguration
  flowContainer: OryFlowContainer
  formState: FormState
  t: TFunction
}

export interface BuildFormContext {
  getValues: UseFormGetValues<FormValues>
  setValue: UseFormSetValue<FormValues>
}
