import { useEffect } from 'react'
import { useTimeout } from 'usehooks-ts'
import { UiNodeInputAttributesOnloadTriggerEnum } from '@ory/client-fetch'

import { useFlowStoreShallow } from '../context'
import { webauthnGroups } from '../types'

function hasPasskeyScript(): boolean {
  return Object.values(UiNodeInputAttributesOnloadTriggerEnum).some(
    (fn) => fn in window,
  )
}

export function useWebAuthnLoader(): void {
  const { flowContainer, webauthnScriptStatus, setWebauthnScriptStatus } =
    useFlowStoreShallow((state) => ({
      flowContainer: state.flowContainer,
      webauthnScriptStatus: state.webauthnScriptStatus,
      setWebauthnScriptStatus: state.setWebauthnScriptStatus,
    }))

  const hasWebAuthn = flowContainer.flow.ui.nodes.some((n) =>
    webauthnGroups.includes(n.group),
  )

  useEffect(() => {
    if (!hasWebAuthn) return
    if (webauthnScriptStatus != null) return
    const id = setInterval(() => {
      if (hasPasskeyScript()) {
        setWebauthnScriptStatus('loaded')
        clearInterval(id)
      }
    }, 100)
    return () => clearInterval(id)
  }, [hasWebAuthn, webauthnScriptStatus, setWebauthnScriptStatus])

  useTimeout(
    () => {
      if (!hasWebAuthn) return
      if (webauthnScriptStatus != null) return
      setWebauthnScriptStatus('failed')
    },
    hasWebAuthn && webauthnScriptStatus == null ? 5000 : null,
  )
}
