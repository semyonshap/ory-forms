import { OryComponents } from "../types"
import { NodeImage } from "./nodes/image"
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
    Card: {
      Root: notImplemented("CardRoot"),
    },
    Node: {
      Button: notImplemented("Button"),
      MethodButton: notImplemented("AuthMethodButton"),
      Select: notImplemented("Select"),
      Input: notImplemented("Input"),
      Code: notImplemented("CodeInput"),
      Image: NodeImage,
      Text: notImplemented("Text"),
      Anchor: notImplemented("Anchor"),
    },
    nodeSorter: defaultNodeSorter,
    groupSorter: defaultGroupSorter,
  }
}
