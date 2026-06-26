import { UiNode } from "@ory/client-fetch"

export interface BaseNode {
  kind: "ory" | "divider" | "header"
}

export interface UiNodeEnhanced extends BaseNode, UiNode {
  kind: "ory"
  ui?: {
    visible?: boolean
    defaultValue?: any
    icon?: string
  }
}

export interface HeaderNode extends BaseNode {
  kind: "header"
  ui: {
    title: string
    description: string
    messageId?: string
  }
}

export interface DividerNode extends BaseNode {
  kind: "divider"
}

export type RenderNode = UiNodeEnhanced | DividerNode | HeaderNode
