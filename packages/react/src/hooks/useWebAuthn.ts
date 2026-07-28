import { useMemo, useState } from 'react'
import { useEventListener, useTimeout } from 'usehooks-ts'
import { UiNodeGroupEnum } from '@ory/client-fetch'

import { useFlowStoreShallow } from '../context'
import { triggerToFunction } from '../lib/nodes'
import { UiNodeInput } from '../types'

export function useWebAuthn(node: UiNodeInput) {
  const enabled =
    node.group === UiNodeGroupEnum.Passkey ||
    node.group === UiNodeGroupEnum.Webauthn

  const setMessages = useFlowStoreShallow((s) => s.setMessages)

  const hasTriggerFn = useMemo(() => {
    if (!node.attributes.onclickTrigger) return false
    return (
      typeof triggerToFunction(node.attributes.onclickTrigger) ===
      'function'
    )
  }, [node.attributes.onclickTrigger])

  const [initializedByEvent, setInitializedByEvent] = useState(false)
  const [failedToLoad, setFailedToLoad] = useState(false)

  useEventListener(
    'oryWebAuthnInitialized' as keyof WindowEventMap,
    () => {
      setInitializedByEvent(true)
    },
  )

  const isInitialized = hasTriggerFn || initializedByEvent

  useTimeout(
    () => {
      if (!isInitialized) {
        setFailedToLoad(true)
        setMessages([
          {
            id: 11,
            text: 'Could not load Passkey libraries. Please try again later.',
            type: 'error',
          },
        ])
      }
    },
    enabled && !isInitialized ? 5000 : null,
  )

  const isDisabled = !isInitialized || failedToLoad

  return { isInitialized, failedToLoad, isDisabled }
}
