import { LogoutFlow } from '@ory/client-fetch'
import { useCallback, useEffect, useState } from 'react'

import { OryConfiguration } from '../types'

export function useLogout(config: OryConfiguration) {
  const [logoutFlow, setLogoutFlow] = useState<LogoutFlow | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchLogoutFlow = useCallback(async () => {
    try {
      const flow = await config.sdk.frontend.createBrowserLogoutFlow().catch((err) => {
        if (err.response?.status !== 401) {
          throw err
        }
        return undefined
      })
      setLogoutFlow(flow)
    } finally {
      setIsLoading(false)
    }
  }, [config.sdk.url])

  useEffect(() => {
    void fetchLogoutFlow()
  }, [fetchLogoutFlow])

  return { logoutFlow, isLoading }
}
