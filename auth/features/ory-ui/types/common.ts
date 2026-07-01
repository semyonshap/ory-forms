import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { OryClientConfiguration } from "./config"
import { OryFlowContainer } from "./container"
import {
  UiNodeAnchor,
  UiNodeAuthMethodInput,
  UiNodeImage,
  UiNodeInput,
  UiNodeInputButton,
  UiNodeText,
} from "./nodes"
import { ComponentType } from "react"

export type FormValues = Record<
  string,
  string | boolean | number | string[] | undefined
>

export type FlowInputProps = {
  config: OryClientConfiguration
  flow: OryFlowContainer
  components: Partial<OryClientComponents>
}

export type OryComponents = {
  Node: {
    Button: ComponentType<{ node: UiNodeInputButton }>
    SsoButton: ComponentType<{ node: UiNodeInputButton }>
    SubmitButton: ComponentType<{ node: UiNodeInput }>
    AuthMethodButton: ComponentType<{ node: UiNodeAuthMethodInput }>

    Select: ComponentType<{ node: UiNode }>

    Input: ComponentType<{ node: UiNodeInput }>
    CodeInput: ComponentType<{ node: UiNodeInput }>
    PasswordInput: ComponentType<{ node: UiNodeInput }>

    Image: ComponentType<{ node: UiNodeImage }>
    Text: ComponentType<{ node: UiNodeText }>
    Anchor: ComponentType<{ node: UiNodeAnchor }>
  }
  nodeSorter: (a: UiNode, b: UiNode, ctx: { flowType: string }) => number
  groupSorter: (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number
}

export type OryClientComponents = {
  Node: Omit<OryComponents["Node"], "Image" | "PasswordInput"> & {
    Image?: ComponentType<{ node: UiNodeImage }>
    PasswordInput?: ComponentType<{ node: UiNodeInput }>
  }
} & Partial<Pick<OryComponents, "nodeSorter" | "groupSorter">>
