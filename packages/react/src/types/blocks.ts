import type { FlowStoreState } from '../context/oryStore'

import { ReactNode } from 'react'
import { ControllerRenderProps } from 'react-hook-form'
import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributesTypeEnum,
  UiTextTypeEnum,
} from '@ory/client-fetch'

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
  children?: ReactNode | ReactNode[]
  attached?: ReactNode | ReactNode[]
  store: FlowStoreState
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
  style?: React.CSSProperties
}

export interface BlockOptionsInput {
  label: string
  messages?: MessageProps[]
}

export type BlockInput = BaseBlockProps & {
  node: UiNodeInput
  props: BlockPropsInput
  options: BlockOptionsInput
}

// Captcha
export interface BlockOptionsCaptcha {
  token: string
  messages?: MessageProps[]
  onSuccess: (token: string) => void
  onError: () => void
  onExpire: () => void
  onBeforeInteractive: () => void
}

export type BlockCaptcha = BaseBlockProps & {
  node: UiNode
  options: BlockOptionsCaptcha
}

// Div

export type BlockDiv = BaseBlockProps & {
  node: UiNodeDiv
  options: {
    variant?: VariantsDiv
  }
}

export type BlockDivider = BaseBlockProps & {
  node: UiNodeDiv
}

// Anchor

type OmittedAnchorKeys = (typeof omittedInputKeys)[number]

export type BlockPropsAnchor = Omit<
  UiNodeAnchorAttributes,
  OmittedAnchorKeys
>
export interface BlockOptionsAnchor {
  variant: VariantsAnchor
  label?: string
}

export type BlockAnchor = BaseBlockProps & {
  node: UiNode
  props: BlockPropsAnchor
  options: BlockOptionsAnchor
}

// Image

type OmittedImageKeys = (typeof omittedInputKeys)[number]

export type BlockImage = BaseBlockProps & {
  node: UiNode
  props: Omit<UiNodeImageAttributes, OmittedImageKeys>
}

// Label

export type BlockLabel = BaseBlockProps & {
  node: UiNode
  options: {
    label?: string
    messages?: MessageProps[]
  }
}

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
  id: string
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

export type BlockForm = BaseBlockProps & {
  options: {
    flowType: OryFlowType
    messages?: MessageProps[]
  }
}
