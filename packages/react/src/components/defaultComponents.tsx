import { logos } from "../assets"
import { OryComponents } from "../types"
import { NodeImage } from "./nodes/image"
import { defaultGroupSorter, defaultNodeSorter } from "../lib/nodes"

export function notImplemented(componentName: string) {
  return function ComponentStub() {
    console.warn(
      `[Ory] Component "${componentName}" is not implemented. Please provide it via OryFlowProvider components prop.`,
    )
    return null
  }
}

export const DefaultComponents: OryComponents = {
  Card: {
    Default: notImplemented("FormCard"),
  },
  Node: {
    Image: NodeImage,
    Label: notImplemented("Label"),
    Button: notImplemented("Button"),
    Input: notImplemented("Input"),
    Code: notImplemented("CodeInput"),
    Text: notImplemented("Text"),
    Anchor: notImplemented("Anchor"),
    Checkbox: notImplemented("Checkbox"),
  },
  Icons: {
    Providers: {
      Apple: logos.Apple,
      Auth0: logos.Auth0,
      Discord: logos.Discord,
      Facebook: logos.Facebook,
      Github: logos.Github,
      Gitlab: logos.Gitlab,
      Google: logos.Google,
      Linkedin: logos.Linkedin,
      Microsoft: logos.Microsoft,
      Slack: logos.Slack,
      Spotify: logos.Spotify,
      X: logos.X,
      Yandex: logos.Yandex,
    },
  },
  nodeSorter: defaultNodeSorter,
  groupSorter: defaultGroupSorter,
}
