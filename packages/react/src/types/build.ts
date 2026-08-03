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

interface Attached {
  attached?: ReactNode
}

export type WrapperBase = {
  node: FormNode
} & Attached

export type WrapperCaptcha = {
  node: UiNode
} & Attached

export type WrapperInput = {
  node: UiNodeInput
} & Attached

export type WrapperImage = {
  node: UiNodeImage
} & Attached

export type WrapperAnchor = {
  node: UiNodeAnchor
} & Attached

export type WrapperText = {
  node: UiNodeText
} & Attached

export type WrapperDiv = {
  node: UiNodeDiv
} & Attached
