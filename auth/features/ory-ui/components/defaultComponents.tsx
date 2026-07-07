import { OryComponents } from "../types"
import { NodeImage } from "./nodes/image"
import { defaultGroupSorter, defaultNodeSorter } from "../lib/nodes"
import { logos } from "../assets"

export function notImplemented(componentName: string) {
  return function ComponentStub() {
    console.warn(
      `[Ory] Component "${componentName}" is not implemented. Please provide it via OryFlowProvider components prop.`,
    )
    return null
  }
}

export const DefaultComponents: OryComponents = {
  Main: {
    FormCard: notImplemented("FormCard"),
    SettingsCard: notImplemented("SettingsCard"),
  },
  Node: {
    Label: notImplemented("Label"),
    Button: notImplemented("Button"),
    Select: notImplemented("Select"),
    Input: notImplemented("Input"),
    Code: notImplemented("CodeInput"),
    Image: NodeImage,
    Text: notImplemented("Text"),
    Anchor: notImplemented("Anchor"),
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
