import { useEffect } from 'react'
import { useTimeout } from 'usehooks-ts'
import { UiNodeInputAttributesOnloadTriggerEnum } from '@ory/client-fetch'

import { webauthnGroups } from '../types'
import { useFlowStoreShallow } from '../context'

function hasPasskeyScript(): boolean {
  return Object.values(UiNodeInputAttributesOnloadTriggerEnum).some(
    (fn) => fn in window,
  )
}

export function useWebAuthnLoader(): void {
  const {
    flowContainer,
    webauthnScriptStatus,
    setWebauthnScriptStatus,
    setMessages,
  } = useFlowStoreShallow((state) => ({
    flowContainer: state.flowContainer,
    webauthnScriptStatus: state.webauthnScriptStatus,
    setWebauthnScriptStatus: state.setWebauthnScriptStatus,
    setMessages: state.setMessages,
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
      setMessages([
        {
          id: 11,
          text: 'Could not load Passkey libraries. Please try again later.',
          type: 'error',
        },
      ])
    },
    hasWebAuthn && webauthnScriptStatus == null ? 5000 : null,
  )
}
