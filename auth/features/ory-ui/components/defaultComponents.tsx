import { OryComponents } from "../types"
import { NodeImage } from "./nodes/nodeImage"
import { defaultGroupSorter, defaultNodeSorter } from "../utils"

export function notImplemented(componentName: string) {
  return function ComponentStub() {
    console.warn(
      `[Ory] Component "${componentName}" is not implemented. Please provide it via OryFlowProvider components prop.`,
    )
    return null
  }
}

export function getDefaultComponents(): OryComponents {
  return {
    Node: {
      Button: notImplemented("Button"),
      SsoButton: notImplemented("SsoButton"),
      SubmitButton: notImplemented("SubmitButton"),
      AuthMethodButton: notImplemented("AuthMethodButton"),
      Select: notImplemented("Select"),
      Input: notImplemented("Input"),
      CodeInput: notImplemented("CodeInput"),
      PasswordInput: notImplemented("PasswordInput"),
      Image: NodeImage,
      Text: notImplemented("Text"),
      Anchor: notImplemented("Anchor"),
    },
    nodeSorter: defaultNodeSorter,
    groupSorter: defaultGroupSorter,
  }
}
