import { ReactNode } from 'react'
import { TFunction } from 'i18next'
import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'

import {
  FormNode,
  FormState,
  GroupSorter,
  NodeSorter,
  OryConfiguration,
  OryFlowContainer,
  UiNodeAnchor,
  UiNodeDiv,
  UiNodeImage,
  UiNodeInput,
  UiNodeText,
} from '.'

// Builder

export type GroupedNodes = Partial<Record<UiNodeGroupEnum, UiNode[]>>
export interface BuildContext {
  config: OryConfiguration
  flowContainer: OryFlowContainer
  formState: FormState
  t: TFunction
}

export interface BuilderSorter {
  nodeSorter: NodeSorter
  groupSorter: GroupSorter
}

// Wrapper

export type BuildWrapperContext = Partial<
  Record<string, React.ReactNode[]>
>

export interface WrapperProps<TNode> {
  node: TNode
  children?: ReactNode
  attached?: ReactNode
}

export type WrapperBase = WrapperProps<FormNode>
export type WrapperCaptcha = WrapperProps<UiNode>
export type WrapperInput = WrapperProps<UiNodeInput>
export type WrapperImage = WrapperProps<UiNodeImage>
export type WrapperAnchor = WrapperProps<UiNodeAnchor>
export type WrapperText = WrapperProps<UiNodeText>
export type WrapperDiv = WrapperProps<UiNodeDiv>
