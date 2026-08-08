'use server'

import { LogoutFlow } from '@ory/client-fetch'

import { headers } from 'next/headers'
import { rewriteJsonResponse } from '../utils/rewrite'
import { orySdkPublicUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
export async function getLogoutFlow({
  returnTo,
}: { returnTo?: string } = {}): Promise<LogoutFlow> {
  const h = await headers()

  const url = await orySdkPublicUrl()
  return serverSideFrontendClient()
    .createBrowserLogoutFlow({
      cookie: h.get('cookie') ?? '',
      returnTo,
    })
    .then((v: LogoutFlow): LogoutFlow => rewriteJsonResponse(v, url))
}
