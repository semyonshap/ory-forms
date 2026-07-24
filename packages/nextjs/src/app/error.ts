'use server'

import { getServerSession } from './session'
import { ErrorFlow, OryError, QueryParams } from '../types'
import { UiNode } from '@ory/client-fetch'
import { createUiText } from '../utils/factory'
import { getLogoutFlow } from './logout'
import { createNavigationNode } from '../utils/presets'
import { upperFirst } from 'lodash-es'
import { getError } from '../utils/error'

export async function getErrorFlow(
  config: { project: { default_redirect_url: string } },
  searchParams: QueryParams | Promise<QueryParams>,
): Promise<ErrorFlow> {
  const params = await searchParams

  const error = await getError(params)

  const session = await getServerSession()

  const result: UiNode[] = []

  if (session) {
    const logoutFlow = await getLogoutFlow()
    result.push(createNavigationNode('logout', logoutFlow.logout_url))
  }

  result.push(createNavigationNode('go_back', config.project.default_redirect_url))

  const messageDescription = createUiText({
    id: 9999111,
    text: getDescription(error),
    type: 'error',
  })

  const messageDetails = createUiText({
    id: 9999111,
    text: `Details: ${JSON.stringify(error, null, 2)}`,
  })

  return {
    id: error.id ?? 'UNSET',
    active: 'error',
    session,
    error,
    ui: {
      action: '#',
      method: 'GET',
      nodes: result,
      messages: [messageDescription, messageDetails],
    },
  }
}

function getDescription(error: OryError) {
  const { message, code } = error
  if (message) return upperFirst(message)

  const statusClass = Math.floor(code / 100)
  switch (statusClass) {
    case 4:
      return 'The server could not handle your request, because it was malformed'
    case 5:
      return 'The server encountered an error and could not complete your request'
    default:
      return 'An unexpected error occurred'
  }
}
