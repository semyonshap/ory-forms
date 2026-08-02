import set from 'lodash-es/set'
import {
  isUiNodeInputAttributes,
  isUiNodeTextAttributes,
  UiContainer,
  UiNode,
  UiNodeGroupEnum,
  UpdateSettingsFlowBody,
} from '@ory/client-fetch'

import {
  FormValues,
  OryFlowContainer,
  OryFlowType,
  supportsSelectAccountPrompt,
} from '../../types'

const prefillIdentifierFields = ['identifier', 'traits.email']

function getLoginHint(search: string): string | undefined {
  const hint = new URLSearchParams(search).get('login_hint')?.trim()
  return hint ? hint : undefined
}

function searchOf(url: string | undefined): string {
  if (!url) {
    return ''
  }
  const index = url.indexOf('?')
  return index === -1 ? '' : url.slice(index)
}

export function resolveLoginHint(
  flowContainer: OryFlowContainer,
): string | undefined {
  if (
    flowContainer.flowType !== OryFlowType.Login &&
    flowContainer.flowType !== OryFlowType.Registration
  ) {
    return undefined
  }

  const fromRequestUrl = getLoginHint(
    searchOf(flowContainer.flow.request_url),
  )
  if (fromRequestUrl) {
    return fromRequestUrl
  }

  const fromOidc =
    flowContainer.flow.oauth2_login_request?.oidc_context?.login_hint?.trim()
  return fromOidc ? fromOidc : undefined
}

export function computeDefaultValues(
  flow: {
    active?: string
    ui: { nodes: UiNode[] }
  },
  transientPayload?: FormValues,
  loginHint?: string,
): FormValues {
  const defaults: FormValues = {}

  for (const node of flow.ui.nodes) {
    const attrs = node.attributes

    if (isUiNodeTextAttributes(attrs)) {
      if (attrs.id === 'totp_secret_key' && attrs.text?.text) {
        set(defaults, attrs.id, attrs.text.text)
        continue
      }
    }

    if (!isUiNodeInputAttributes(attrs)) {
      continue
    }

    if (attrs.name === 'method' || attrs.type === 'submit') {
      continue
    }

    if (attrs.type === 'checkbox' && typeof attrs.value === 'undefined') {
      set(defaults, attrs.name, false)
      continue
    }

    if (attrs.name.startsWith('grant_scope')) {
      const scope = attrs.value as string
      if (Array.isArray(defaults.grant_scope)) {
        defaults.grant_scope.push(scope)
      } else {
        defaults.grant_scope = [scope]
      }
      continue
    }

    set(defaults, attrs.name, attrs.value ?? '')
  }

  if (flow.active) {
    defaults.method = flow.active
  }

  if (transientPayload) {
    defaults.transient_payload = JSON.stringify(transientPayload)
  }

  prefillIdentifierFromHint(flow.ui.nodes, defaults, loginHint)

  return defaults
}

function prefillIdentifierFromHint(
  nodes: UiNode[],
  defaults: FormValues,
  loginHint?: string,
): void {
  const hint = loginHint?.trim()
  if (!hint) {
    return
  }

  for (const name of prefillIdentifierFields) {
    const node = nodes.find(
      (n) =>
        isUiNodeInputAttributes(n.attributes) &&
        n.attributes.name === name,
    )
    if (!node || !isUiNodeInputAttributes(node.attributes)) {
      continue
    }
    const current = node.attributes.value
    if (current === undefined || current === null || current === '') {
      set(defaults, name, hint)
      return
    }
  }
}

export function flowHasErrors(ui: UiContainer): boolean {
  if (ui.messages?.some((m) => m.type === 'error')) {
    return true
  }
  return ui.nodes.some((node) =>
    node.messages.some((m) => m.type === 'error'),
  )
}

export function applySelectAccountPrompt(
  data: UpdateSettingsFlowBody,
): void {
  if (
    data.method === UiNodeGroupEnum.Oidc &&
    data.link &&
    supportsSelectAccountPrompt.includes(data.link)
  ) {
    data.upstream_parameters = { prompt: 'select_account' }
  }
}
