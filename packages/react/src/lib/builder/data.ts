import { UiNode, UiNodeGroupEnum, UiNodeInputAttributesTypeEnum } from '@ory/client-fetch'

import {
  BuildFormContext,
  FormNode,
  isUiNodeAnchor,
  isUiNodeInput,
  OryFlowContainer,
  OryFlowType,
} from '../../types'
import { withNodeData } from '../nodes'

export function NodeDataBuilder({
  nodes,
  formCtx,
  flowContainer,
}: {
  nodes: UiNode[]
  formCtx: BuildFormContext
  flowContainer: OryFlowContainer
}): FormNode[] {
  const { flowType } = flowContainer
  const { setValue, getValues } = formCtx
  return nodes.map((n) => {
    if (isUiNodeInput(n)) {
      switch (n.attributes.type) {
        case UiNodeInputAttributesTypeEnum.Submit: {
          const name = n.attributes.name
          const group = n.group

          // is Resend Button
          if (name === 'resend' || ['email', 'recovery_confirm_address'].includes(name))
            return withNodeData(n, {
              target: 'code',
              variant: 'resend',
              onClick: () => setValue('code', ''),
            })

          // is Submit Code button
          if (group === UiNodeGroupEnum.Code && name === 'method')
            return withNodeData(n, {
              onClick: () => {
                const code = getValues('code')
                switch (flowType) {
                  case OryFlowType.Login:
                  case OryFlowType.Registration:
                    if (code) setValue('resend', '')
                    break
                  case OryFlowType.Recovery:
                  case OryFlowType.Verification:
                    setValue('email', '')
                    break
                }
              },
            })

          // is SSO button
          if (group === UiNodeGroupEnum.Oidc || group === UiNodeGroupEnum.Saml)
            return withNodeData(n, { variant: 'sso' })

          // is Adress button in code send
          if (name === 'address') return withNodeData(n, { variant: 'expand' })

          // is Scope Checkbox
          if (group === UiNodeGroupEnum.Oauth2Consent && name === 'grant_scope')
            return withNodeData(n, { variant: 'scope' })

          // is reject button
          if (n.attributes.value === 'reject') return withNodeData(n, { variant: 'cancel' })

          break
        }
        default:
          break
      }
    } else if (isUiNodeAnchor(n)) {
      // is logout button
      if (n.attributes.id === 'logout') {
        return withNodeData(n, { variant: 'cancel' })
      }
    }

    return n
  })
}
