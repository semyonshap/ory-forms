import { ComponentType, useMemo } from 'react'

import { UiNodeInput } from '../types'
import { normalizeKeys } from '../utils'
import { useFlowStoreShallow } from '../context'

export function useButtonIcon(
  node: UiNodeInput,
): ComponentType | undefined {
  const { providers, system } = useFlowStoreShallow((state) => ({
    providers: state.components.Icons.Providers,
    system: state.components.Icons.System,
  }))

  const IconsProviders = useMemo(
    () => normalizeKeys(providers ?? {}),
    [providers],
  )
  const IconsSystem = useMemo(() => normalizeKeys(system ?? {}), [system])

  const variant = node.data?.variant
  const group = node.group

  switch (variant) {
    case 'method':
      return system ? IconsSystem?.[group] : undefined
    case 'oidc':
    case 'sso': {
      const iconKey = (node.attributes.value as string).split('-')[0]
      return IconsProviders?.[iconKey]
    }
    default:
      return undefined
  }
}
