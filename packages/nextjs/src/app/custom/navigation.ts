'use server'

import { FrontendApi, UiNode } from '@ory/client-fetch'

import { getLogoutFlow } from './logout'
import { getServerSession } from '../session'
import { createNavigationNode } from '../../utils/presets'
import { NavigationFlow, OryFlowConfig } from '../../types'

export async function getNavigationFlow(
  api: FrontendApi,
  config: OryFlowConfig,
): Promise<NavigationFlow | null> {
  const {
    login_ui_url,
    recovery_ui_url,
    registration_ui_url,
    settings_ui_url,
    verification_ui_url,
  } = config.project

  const { session, status } = await getServerSession()
  const result: UiNode[] = []

  if (!session) {
    if (status === 'unauthenticated') {
      result.push(
        createNavigationNode('login', login_ui_url),
        createNavigationNode('registration', registration_ui_url),
        createNavigationNode('recovery', recovery_ui_url),
      )
    } else if (status === '2fa_required') {
      const logoutFlow = await getLogoutFlow(api)

      result.push(
        createNavigationNode('settings', settings_ui_url),
        createNavigationNode('logout', logoutFlow.logout_url),
      )
    }
  } else {
    const { identity } = session

    if (identity && !identity.verifiable_addresses) {
      result.push(
        createNavigationNode('verification', verification_ui_url),
      )
    }

    const logoutFlow = await getLogoutFlow(api)

    result.push(
      createNavigationNode('settings', settings_ui_url),
      createNavigationNode('logout', logoutFlow.logout_url),
    )
  }

  return {
    id: 'UNSET',
    active: 'navigation',
    session,
    ui: {
      action: '#',
      method: 'GET',
      nodes: result,
      messages: [],
    },
  }
}
