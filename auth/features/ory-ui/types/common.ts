import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { OryClientConfiguration } from "./config"
import { OryFlowContainer } from "./container"
import {
  ComponentPropsWithoutRef,
  ComponentType,
  FormEventHandler,
} from "react"
import {
  FormRenderMethodButton,
  FormRenderSelect,
  FormRenderInput,
  FormRenderImage,
  FormRenderText,
  FormRenderAnchor,
  CardRenderRoot,
  FormRenderLabel,
  FormRenderButton,
} from "./render"

export type FormValues = Record<
  string,
  string | boolean | number | string[] | undefined
>

export type FormRootProps = ComponentPropsWithoutRef<"form"> & {
  onSubmit: FormEventHandler<HTMLFormElement>
}

export type FlowInputProps = {
  config: OryClientConfiguration
  flow: OryFlowContainer
  components: Partial<OryClientComponents>
}

export type NodeSorter = (
  a: UiNode,
  b: UiNode,
  ctx: { flowType: string },
) => number

export type GroupSorter = (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number

export type OryComponents = {
  Card: {
    Root: ComponentType<CardRenderRoot>
  }
  Node: {
    Label: ComponentType<FormRenderLabel>

    Button: ComponentType<FormRenderButton>
    MethodButton: ComponentType<FormRenderMethodButton>

    Select: ComponentType<FormRenderSelect>

    Input: ComponentType<FormRenderInput>
    Code: ComponentType<FormRenderInput>
    Password?: ComponentType<FormRenderInput>

    Image: ComponentType<FormRenderImage>
    Text: ComponentType<FormRenderText>
    Anchor: ComponentType<FormRenderAnchor>
  }
  nodeSorter: NodeSorter
  groupSorter: GroupSorter
}

export type OryClientComponents = {
  Card: OryComponents["Card"]
  Node: Omit<OryComponents["Node"], "Image" | "Password"> & {
    Image?: ComponentType<FormRenderImage>
  }
} & Partial<Pick<OryComponents, "nodeSorter" | "groupSorter">>
