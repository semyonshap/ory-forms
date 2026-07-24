import { UiNodeInputAttributes } from '@ory/client-fetch'
import { useCallback, useState } from 'react'
import { useEventListener, useTimeout } from 'usehooks-ts'

import { triggerToFunction } from '../lib/nodes'

interface UsePasskeyOptions {
  passkeyNode: { attributes: UiNodeInputAttributes }
  disabled?: boolean
}

export function useMethodPasskey({ passkeyNode, disabled = false }: UsePasskeyOptions) {
  const [failedToLoad, setFailedToLoad] = useState(false)

  const fn = passkeyNode.attributes.onclickTrigger
    ? triggerToFunction(passkeyNode.attributes.onclickTrigger)
    : undefined
  const isInitialized = typeof fn === 'function'
  const [_, setIsInitialized] = useState(isInitialized)

  useEventListener('oryWebAuthnInitialized' as keyof WindowEventMap, () => {
    setIsInitialized(true)
  })

  useTimeout(() => {
    if (!isInitialized && isInitialized !== undefined) {
      setFailedToLoad(true)
    }
  }, 5000)

  const handleClick = useCallback(() => {
    if (!passkeyNode.attributes.onclickTrigger) {
      console.error('Passkey node does not have onclickTrigger')
      return
    }
    const fn = triggerToFunction(passkeyNode.attributes.onclickTrigger)
    if (fn) {
      fn()
    } else {
      console.error('Passkey node trigger function not found')
    }
  }, [passkeyNode])

  const isDisabled = disabled || !isInitialized || failedToLoad

  return {
    isInitialized,
    failedToLoad,
    handleClick,
    isDisabled,
  }
}
