import { LogoutFlow } from '@ory/client-fetch'
import { useEffect, useState } from 'react'

import { OryConfiguration } from '../types'

export function useLogout(config: OryConfiguration) {
  const [logoutFlow, setLogoutFlow] = useState<LogoutFlow | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const flow = await config.sdk.frontend.createBrowserLogoutFlow().catch((err) => {
          if (err.response?.status !== 401) throw err
          return undefined
        })
        setLogoutFlow(flow)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [config.sdk.frontend])

  return { logoutFlow, isLoading }
}
