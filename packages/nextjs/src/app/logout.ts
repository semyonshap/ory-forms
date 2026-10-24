'use server'

import { headers } from 'next/headers'
import { LogoutFlow } from '@ory/client-fetch'

import { orySdkPublicUrl } from '../utils/sdk'
import { serverSideFrontendClient } from './client'
import { rewriteJsonResponse } from '../utils/rewrite'
export async function getLogoutFlow({
  returnTo,
}: { returnTo?: string } = {}): Promise<LogoutFlow> {
  const h = await headers()

  const url = orySdkPublicUrl()
  return serverSideFrontendClient()
    .createBrowserLogoutFlow({
      cookie: h.get('cookie') ?? '',
      returnTo,
    })
    .then((v: LogoutFlow): LogoutFlow => rewriteJsonResponse(v, url))
}
