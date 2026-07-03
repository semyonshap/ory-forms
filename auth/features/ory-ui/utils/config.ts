import { DefaultComponents } from "../components/defaultComponents"
import {
  OryComponents,
  OryConfiguration,
  OryClientComponents,
  OryClientConfiguration,
} from "../types"
import { defaultGroupSorter, defaultNodeSorter } from "./sorter"
import { normalizeUrl } from "./windowUtils"

export function computeComponents(
  components?: Partial<OryClientComponents>,
): OryComponents {
  return {
    Card: {
      Root: components?.Card?.Root ?? DefaultComponents.Card.Root,
    },
    Node: {
      Label: components?.Node?.Label ?? DefaultComponents.Node.Label,
      Button: components?.Node?.Button ?? DefaultComponents.Node.Button,
      MethodButton:
        components?.Node?.MethodButton ?? DefaultComponents.Node.MethodButton,
      Select: components?.Node?.Select ?? DefaultComponents.Node.Select,
      Input: components?.Node?.Input ?? DefaultComponents.Node.Input,
      Code: components?.Node?.Code ?? DefaultComponents.Node.Code,
      Image: components?.Node?.Image ?? DefaultComponents.Node.Image,
      Text: components?.Node?.Text ?? DefaultComponents.Node.Text,
      Anchor: components?.Node?.Anchor ?? DefaultComponents.Node.Anchor,
    },
    nodeSorter: components?.nodeSorter ?? defaultNodeSorter,
    groupSorter: components?.groupSorter ?? defaultGroupSorter,
  }
}

export function computeSdkConfig(
  config?: OryClientConfiguration["sdk"],
): OryConfiguration["sdk"] {
  if (config?.url && typeof config.url === "string") {
    return {
      url: normalizeUrl(config.url),
      options: config.options || {},
    }
  }

  return {
    url: getSdkUrl(),
    options: config?.options || {},
  }
}

export function getSdkUrl(): string {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ORY_SDK_URL) {
    return process.env.NEXT_PUBLIC_ORY_SDK_URL
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin
  }

  throw new Error(
    "ORY SDK URL is not configured. Please set sdk.url in the configuration, " +
      "or provide NEXT_PUBLIC_ORY_SDK_URL environment variable.",
  )
}
