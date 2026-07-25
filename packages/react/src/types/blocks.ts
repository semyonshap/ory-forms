import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributesTypeEnum,
  UiTextTypeEnum,
} from '@ory/client-fetch'
import { PropsWithChildren, ReactNode } from 'react'
import { ControllerRenderProps } from 'react-hook-form'

import {
  omittedInputKeys,
  UiNodeInput,
  UiNodeText,
  UiNodeDiv,
  VariantsInput,
  VariantsAnchor,
  OryFlowType,
  VariantsDiv,
} from '.'

// Common

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export type IconType = React.ComponentType<IconProps>

export interface MessageProps {
  id: number
  text: string
  type: UiTextTypeEnum
}

interface BaseBlockProps {
  attached?: ReactNode | ReactNode[]
}

// Button

export interface BlockPropsButton {
  type: 'button' | 'submit' | 'reset'
  name: string
  value: string | number | readonly string[] | undefined
  onClick: (event: React.MouseEvent) => void
  disabled?: boolean
}

export interface BlockOptionsButton {
  variant: VariantsInput
  label?: string
  description?: string
  icon?: IconType
  isSubmitting?: boolean
}

export type BlockButton = BaseBlockProps & {
  node: UiNodeInput
  props: BlockPropsButton
  options: BlockOptionsButton
}

// Checkbox

export type BlockPropsCheckbox = ControllerRenderProps & {
  checked: boolean
}

export interface BlockOptionsCheckbox {
  label?: string
  description?: string
  icon?: IconType
}

export type BlockCheckbox = BaseBlockProps & {
  node: UiNodeInput
  props: BlockPropsCheckbox
  options: BlockOptionsCheckbox
}

// Input

export type BlockPropsInput = ControllerRenderProps & {
  id: string
  type: UiNodeInputAttributesTypeEnum
  placeholder: string
  maxLength?: number
  autoComplete?: string
  readOnly?: boolean
}

export interface BlockOptionsInput {
  label: string
}

export type RenderInput = BaseBlockProps & {
  node: UiNodeInput
  props: BlockPropsInput
  options: BlockOptionsInput
}

// Div

export type BlockDiv = BaseBlockProps & {
  node: UiNodeDiv
  options: {
    variant?: VariantsDiv
  }
}

export interface BlockDivider {
  node: UiNodeDiv
}

// Anchor

type OmittedAnchorKeys = (typeof omittedInputKeys)[number]

export type BlockAnchor = BaseBlockProps & {
  node: UiNode
  props: Omit<UiNodeAnchorAttributes, OmittedAnchorKeys>
  options: {
    variant: VariantsAnchor
    label?: string
  }
}

// Image

type OmittedImageKeys = (typeof omittedInputKeys)[number]

export type BlockImage = BaseBlockProps & {
  node: UiNode
  props: Omit<UiNodeImageAttributes, OmittedImageKeys>
}

// Label

export type BlockLabel = BaseBlockProps & {
  node: UiNodeInput
  options: {
    label?: string
    messages?: MessageProps[]
  }
} & PropsWithChildren

// Text

export type BlockText = BaseBlockProps & {
  node: UiNodeText
  options: {
    label?: string
    text?: string
  }
}

// Card

export interface BlockPropsCard {
  key: string
  action: string
  method: string
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
}

export interface BlockOptionsCard {
  flowType: OryFlowType
  title?: string
  description?: string
  messages?: MessageProps[]
}

export type BlockCard = BlockDiv & {
  props: BlockPropsCard
  options: BlockOptionsCard
}

// Form

export type BlockForm = PropsWithChildren & {
  options: {
    flowType: OryFlowType
    messages?: MessageProps[]
  }
}
