import { LogoutFlow, UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form'

import {
  FormNode,
  FormState,
  FormValues,
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
import { TFunction } from 'i18next'
import { ReactNode } from 'react'

// Builder

export type GroupedNodes = Partial<Record<UiNodeGroupEnum, UiNode[]>>

export interface BuildContext {
  config: OryConfiguration
  flowContainer: OryFlowContainer
  formState: FormState
  t: TFunction
}

export interface BuildRHFContext {
  getValues: UseFormGetValues<FormValues>
  setValue: UseFormSetValue<FormValues>
}

export interface BuilderLogoutFlow {
  logoutFlow: LogoutFlow | undefined
  logoutLoading: boolean
}

export interface BuilderSorter {
  selectMethod: (method: UiNodeGroupEnum) => void
  clearMethod: () => void
  nodeSorter: NodeSorter
  groupSorter: GroupSorter
}

// Wrapper

export type BuildWrapperContext = Partial<Record<string, React.ReactNode[]>>

interface Attached {
  attached?: ReactNode
}

export type WrapperBase = {
  node: FormNode
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
