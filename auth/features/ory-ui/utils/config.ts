import {
  OryComponents,
  OryConfiguration,
  OryClientComponents,
  OryClientConfiguration,
} from "../types"
import { normalizeUrl } from "./windowUtils"

export function computeComponents(
  defaultComponents: OryComponents,
  overrideComponents: Partial<OryClientComponents>,
): OryComponents {
  return {
    Node: {
      ...defaultComponents.Node,
      ...(overrideComponents.Node || {}),
    },
    nodeSorter: overrideComponents.nodeSorter ?? defaultComponents.nodeSorter,
    groupSorter:
      overrideComponents.groupSorter ?? defaultComponents.groupSorter,
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
