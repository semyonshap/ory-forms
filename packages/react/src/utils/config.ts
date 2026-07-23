import { DefaultComponents } from "../components/defaultComponents"
import {
  OryComponents,
  OryConfiguration,
  OryClientComponents,
  OryClientConfiguration,
} from "../types"
import { defaultGroupSorter, defaultNodeSorter } from "../lib/nodes/sorter"
import { frontendClient } from "./sdk"

export function normalizeUrl(url: string): string {
  return url.replace(/\/$/, "")
}

export function computeComponents(
  components?: Partial<OryClientComponents>,
): OryComponents {
  const defaultComponents = DefaultComponents
  const overrides = components ?? {}

  return {
    Card: {
      ...defaultComponents.Card,
      ...overrides.Card,
    },
    Node: {
      ...defaultComponents.Node,
      ...overrides.Node,
    },
    Icons: {
      Providers: {
        ...defaultComponents.Icons.Providers,
        ...overrides.Icons?.Providers,
      },
      System: components?.Icons?.System,
    },
    nodeSorter: overrides.nodeSorter ?? defaultNodeSorter,
    groupSorter: overrides.groupSorter ?? defaultGroupSorter,
  }
}

export function computeSdkConfig(
  config?: OryClientConfiguration["sdk"],
): OryConfiguration["sdk"] {
  const url =
    config?.url && typeof config.url === "string"
      ? normalizeUrl(config.url)
      : getSdkUrl()
  const options = config?.options || {}

  return { url, options, frontend: frontendClient(url, options) }
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
