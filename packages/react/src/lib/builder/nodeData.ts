import { UiNode, UiNodeGroupEnum, UiNodeInputAttributesTypeEnum } from '@ory/client-fetch'

import {
  AnchorNodeData,
  BuildFormContext,
  FormNode,
  InputNodeData,
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
  formCtx: BuildFormContext
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
            const data: InputNodeData = {
              target: 'code',
              type: 'resend',
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
            const data: InputNodeData = {
              onClick: () => {
                const code = getValues('code')
                switch (flowType) {
                  case OryFlowType.Login:
                  case OryFlowType.Registration:
                    if (code) setValue('resend', '')
                  case OryFlowType.Recovery:
                  case OryFlowType.Verification:
                    setValue('email', '')
                    setValue('code', '')
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
            const data: InputNodeData = {
              variant: 'sso',
            }

            return {
              ...n,
              data,
            }
          } else if (n.attributes.name === 'address') {
            // is Adress button in code send
            const data: InputNodeData = {
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
            const data: InputNodeData = {
              variant: 'scope',
            }

            return {
              ...n,
              data,
            }
          } else if (n.attributes.value === 'reject') {
            const data: InputNodeData = {
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
        const data: AnchorNodeData = {
          ...n.data,
          variant: 'cancel',
        }
        return { ...n, data }
      }
    }

    return n
  })
}
