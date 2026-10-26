import { frontendClient } from './client'
import { DefaultComponents } from '../components/defaultComponents'
import { defaultGroupSorter, defaultNodeSorter } from '../lib/nodes/sorter'
import {
  OryComponents,
  OryConfiguration,
  OryClientComponents,
  OryClientConfiguration,
} from '../types'

function normalizeUrl(url: string): string {
  return url.replace(/\/$/, '')
}

export function computeComponents(
  components?: Partial<OryClientComponents>,
): OryComponents {
  const defaultComponents = DefaultComponents
  const overrides = components ?? {}

  return {
    Layout: {
      ...defaultComponents.Layout,
      ...overrides.Layout,
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
    nodeFilter: overrides.nodeFilter ?? (() => true),
  }
}

export function computeConfig(
  config: OryClientConfiguration,
): OryConfiguration {
  const options = config.sdk?.options ?? {}
  const url =
    config.sdk?.url && typeof config.sdk.url === 'string'
      ? normalizeUrl(config.sdk.url)
      : getSdkUrl()

  return {
    sdk: {
      url,
      options,
      frontend: frontendClient(url, options),
    },
    project: {
      ...config.project,
    },
  }
}

function getSdkUrl(): string {
  const sdkUrl = process.env.NEXT_PUBLIC_ORY_SDK_URL

  if (sdkUrl) {
    return normalizeUrl(sdkUrl)
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  throw new Error(
    'You need to set environment variable: NEXT_PUBLIC_ORY_SDK_URL.' +
      'or  set sdk.url in the configuration',
  )
}
