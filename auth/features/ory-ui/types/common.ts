import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { OryClientConfiguration } from "./config"
import { OryFlowContainer } from "./container"

export type FormValues = Record<
  string,
  string | boolean | number | string[] | undefined
>

export type FlowInputOptions = {
  only?: FlowMethod
}

export type FlowInputProps = {
  config: OryClientConfiguration
  flow: OryFlowContainer
  components?: Partial<OryComponents>
}

export type OryComponents = {
  nodeSorter: (a: UiNode, b: UiNode, ctx: { flowType: string }) => number
  groupSorter: (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number
}

export type FlowMethod =
  | "oidc"
  | "password"
  | "profile"
  | "totp"
  | "webauthn"
  | "passkey"
  | "link"
  | "lookup_secret"
