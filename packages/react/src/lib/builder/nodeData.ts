import { UiNode, UiNodeGroupEnum, UiNodeInputAttributesTypeEnum } from '@ory/client-fetch'

import {
  NodeDataAnchor,
  BuildRHFContext,
  FormNode,
  NodeDataInput,
  isUiNodeAnchor,
  isUiNodeInput,
  OryFlowContainer,
  OryFlowType,
} from '../../types'

export function NodeDataBuilder({
  nodes,
  formCtx,
  flowContainer,
}: {
  nodes: UiNode[]
  formCtx: BuildRHFContext
  flowContainer: OryFlowContainer
}): FormNode[] {
  const { flowType } = flowContainer
  const { setValue, getValues } = formCtx
  return nodes.map((n) => {
    if (isUiNodeInput(n)) {
      switch (n.attributes.type) {
        case UiNodeInputAttributesTypeEnum.Submit: {
          if (
            n.attributes.name === 'resend' ||
            ['email', 'recovery_confirm_address'].includes(n.attributes.name)
          ) {
            // is Resend Button
            const data: NodeDataInput = {
              target: 'code',
              variant: 'link',
              onClick: () => {
                setValue('code', '')
              },
            }

            return {
              ...n,
              data,
            }
          } else if (
            // is Submit Code button
            n.group === UiNodeGroupEnum.Code &&
            n.attributes.name === 'method'
          ) {
            const data: NodeDataInput = {
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
                    setValue('code', '')
                    break
                }
              },
            }

            return {
              ...n,
              data,
            }
          } else if (
            // is SSO button
            n.group === UiNodeGroupEnum.Oidc ||
            n.group === UiNodeGroupEnum.Saml
          ) {
            const data: NodeDataInput = {
              variant: 'sso',
            }

            return {
              ...n,
              data,
            }
          } else if (n.attributes.name === 'address') {
            // is Adress button in code send
            const data: NodeDataInput = {
              variant: 'code',
            }

            return {
              ...n,
              data,
            }
          } else if (
            n.group === UiNodeGroupEnum.Oauth2Consent &&
            n.attributes.name === 'grant_scope'
          ) {
            // is Scope Checkbox
            const data: NodeDataInput = {
              variant: 'scope',
            }

            return {
              ...n,
              data,
            }
          } else if (n.attributes.value === 'reject') {
            const data: NodeDataInput = {
              variant: 'cancel',
            }

            return {
              ...n,
              data,
            }
          }
        }
      }
    } else if (isUiNodeAnchor(n)) {
      if (n.attributes.id === 'logout') {
        const data: NodeDataAnchor = {
          ...n.data,
          variant: 'cancel',
        }
        return { ...n, data }
      }
    }

    return n
  })
}
