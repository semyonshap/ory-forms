import { useCallback, useSyncExternalStore } from 'react'

export function useIsMobile(MOBILE_BREAKPOINT = 768) {
  const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
