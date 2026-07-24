import {
  UiNodeInputAttributesOnclickTriggerEnum,
  UiNodeInputAttributesOnloadTriggerEnum,
} from '@ory/client-fetch'

export function triggerToWindowCall(
  trigger:
    UiNodeInputAttributesOnclickTriggerEnum | UiNodeInputAttributesOnloadTriggerEnum | undefined,
): void {
  if (!trigger) return

  const fn = triggerToFunction(trigger)
  if (fn) {
    fn()
    return
  }

  // Retry every 100ms for 10 seconds
  let i = 0
  const ms = 100
  const interval = setInterval(() => {
    i++
    if (i > 100) {
      clearInterval(interval)
      throw new Error(
        "Unable to load Ory's WebAuthn script. Is it being blocked or otherwise failing to load? If you are running an old version of Ory Elements, please upgrade. For more information, please check your browser's developer console.",
      )
    }

    const fn = triggerToFunction(trigger)
    if (fn) {
      clearInterval(interval)
      fn()
    }
  }, ms)
}

export function triggerToFunction(
  trigger: UiNodeInputAttributesOnclickTriggerEnum | UiNodeInputAttributesOnloadTriggerEnum,
): (() => void) | undefined {
  if (typeof window === 'undefined') {
    console.debug('The Ory SDK is missing a required function: window is undefined.')
    return undefined
  }

  const typedWindow = window as unknown as Record<string, unknown>
  if (!(trigger in typedWindow) || typeof typedWindow[trigger] !== 'function') {
    console.debug(`The Ory SDK is missing a required function: ${trigger}.`)
    return undefined
  }

  return typedWindow[trigger] as () => void
}
