import {
  mapValues,
  omitBy,
  isNil,
  isPlainObject,
  compact,
  replace,
} from 'lodash-es'
import { orySdkUrl } from './sdk'
import { joinUrlPaths } from './utils'
import { OryMiddlewareOptions } from '../types'

export function rewriteUrls(
  source: string,
  matchBaseUrl: string,
  selfUrl: string,
  config: OryMiddlewareOptions,
) {
  const routes: Record<string, string | undefined> = {
    '/ui/recovery': config.project?.recovery_ui_url,
    '/ui/registration': config.project?.registration_ui_url,
    '/ui/login': config.project?.login_ui_url,
    '/ui/verification': config.project?.verification_ui_url,
    '/ui/settings': config.project?.settings_ui_url,
    '/ui/welcome': config.project?.default_redirect_url,
    '/recovery': config.project?.recovery_ui_url,
    '/registration': config.project?.registration_ui_url,
    '/login': config.project?.login_ui_url,
    '/verification': config.project?.verification_ui_url,
    '/settings': config.project?.settings_ui_url,
  }

  for (const [matchPath, replaceWith] of Object.entries(routes)) {
    const match = joinUrlPaths(matchBaseUrl, matchPath)
    if (replaceWith && source.startsWith(match)) {
      source = replace(
        source,
        match,
        new URL(replaceWith, selfUrl).toString(),
      )
    }
  }

  const base = replace(matchBaseUrl, /\/$/, '')
  const self = replace(new URL(selfUrl).toString(), /\/$/, '')
  return replace(source, base, self)
}

export function rewriteJsonResponse<T extends object>(
  obj: T,
  proxyUrl?: string,
): T {
  const sdkUrl = orySdkUrl()

  const transform = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return compact(value.map((item) => transform(item)))
    }
    if (isPlainObject(value)) {
      return mapValues(omitBy(value as object, isNil), (v) => transform(v))
    }
    if (typeof value === 'string' && proxyUrl) {
      return replace(value, sdkUrl, proxyUrl)
    }
    return value
  }

  return transform(obj) as T
}
