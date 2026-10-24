'use server'

import { headers } from 'next/headers'
import { FrontendApi, LogoutFlow } from '@ory/client-fetch'

import { orySdkPublicUrl } from '../../utils/sdk'
import { rewriteJsonResponse } from '../../utils/rewrite'
export async function getLogoutFlow(
  api: FrontendApi,
  { returnTo }: { returnTo?: string } = {},
): Promise<LogoutFlow> {
  const h = await headers()

  const url = orySdkPublicUrl()
  return api
    .createBrowserLogoutFlow({
      cookie: h.get('cookie') ?? '',
      returnTo,
    })
    .then((v: LogoutFlow): LogoutFlow => rewriteJsonResponse(v, url))
}
