import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { OryClientConfiguration } from "./config"
import { OryFlowContainer } from "./container"
import { ComponentType } from "react"
import {
  FormRenderButton,
  FormRenderAuthMethodButton as FormRenderMethodButton,
  FormRenderSelect,
  FormRenderInput,
  FormRenderImage,
  FormRenderText,
  FormRenderAnchor,
  CardRenderRoot,
  CardRenderFooter,
} from "./render"

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
  Card: {
    Root: ComponentType<CardRenderRoot>
    Footer: ComponentType<CardRenderFooter>
  }
  Node: {
    Button: ComponentType<FormRenderButton>
    SsoButton?: ComponentType<FormRenderButton>
    SubmitButton?: ComponentType<FormRenderButton>
    MethodButton: ComponentType<FormRenderMethodButton>

    Select: ComponentType<FormRenderSelect>

    Input: ComponentType<FormRenderInput>
    Code: ComponentType<FormRenderInput>
    Password?: ComponentType<FormRenderInput>

    Image: ComponentType<FormRenderImage>
    Text: ComponentType<FormRenderText>
    Anchor: ComponentType<FormRenderAnchor>
  }
  nodeSorter: (a: UiNode, b: UiNode, ctx: { flowType: string }) => number
  groupSorter: (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number
}

export type OryClientComponents = {
  Card: OryComponents["Card"]
  Node: Omit<OryComponents["Node"], "Image" | "Password"> & {
    Image?: ComponentType<FormRenderImage>
  }
} & Partial<Pick<OryComponents, "nodeSorter" | "groupSorter">>
