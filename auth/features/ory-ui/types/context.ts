import { FormNode, UiNodeAnchor, UiNodeImage, UiNodeInput, UiNodeText } from "."

export type FormContext = Partial<Record<string, React.ReactNode[]>>
export type FormNodeContext = {
  node: FormNode
  context?: FormContext
}

export type UiNodeInputContext = {
  node: UiNodeInput
  context?: FormContext
}

export type UiNodeImageContext = {
  node: UiNodeImage
  context?: FormContext
}

export type UiNodeAnchorContext = {
  node: UiNodeAnchor
  context?: FormContext
}

export type UiNodeTextContext = {
  node: UiNodeText
  context?: FormContext
}
