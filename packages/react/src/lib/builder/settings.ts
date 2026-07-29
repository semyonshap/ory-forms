import { TFunction } from 'i18next'
import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'

import { settingsFooter } from './settingsFooter'
import {
  createDivGroup,
  createInputNode,
  createUiText,
} from '../nodes/factory'
import {
  NodeDataInput,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeText,
  UiNodeInput,
  UiNodeText,
} from '../../types'

export function SettingsBuilder(
  group: UiNodeGroupEnum,
  nodes: UiNode[],
  t: TFunction,
  allNodes: UiNode[],
) {
  switch (group) {
    case UiNodeGroupEnum.Totp: {
      const secretKeyText = nodes.find(
        (n): n is UiNodeText =>
          isUiNodeText(n) && n.attributes.id === 'totp_secret_key',
      )
      const secretQr = nodes.find(
        (n) => isUiNodeImage(n) && n.attributes.id === 'totp_qr',
      )
      const secretCode = nodes.find(
        (n): n is UiNodeInput =>
          isUiNodeInput(n) && n.attributes.name === 'totp_code',
      )

      if (secretKeyText && secretQr && secretCode) {
        const secretKeyInput = createInputNode({
          group,
          attributes: {
            name: 'totp_secret_key',
            type: 'text',
            disabled: false,
            value: secretKeyText.attributes.text?.text,
            label: createUiText({
              keyOrId: 1050017,
              text: 'Authenticator Secret',
              t,
            }),
          },
          data: {
            readOnly: true,
          },
        })

        const secretRightGroup = createDivGroup({
          id: `${group}-secret-right-div`,
          data: {
            variant: 'totp-secret',
          },
          children: [secretKeyInput, secretCode],
        })

        const secretGroup = createDivGroup({
          id: `${group}-secret-div`,
          data: {
            variant: 'totp-qr',
          },
          children: [secretQr, ...secretRightGroup],
        })

        nodes.splice(nodes.indexOf(secretCode), 1)
        nodes.splice(nodes.indexOf(secretKeyText), 1)
        nodes.splice(nodes.indexOf(secretQr), 1, ...secretGroup)
      }
      break
    }
    case UiNodeGroupEnum.Oidc:
      nodes.forEach((n) => {
        if (isUiNodeInput(n) && n.attributes.type === 'submit') {
          const data: NodeDataInput = {
            variant: 'oidc',
          }
          n.data = { ...n.data, ...data }
        }
      })
      break
    case UiNodeGroupEnum.Password: {
      const emailNode = allNodes.find(
        (n): n is UiNodeInput =>
          isUiNodeInput(n) &&
          n.group === UiNodeGroupEnum.Profile &&
          n.attributes.name === 'traits.email',
      )
      const emailValue = emailNode?.attributes.value

      if (emailValue) {
        const hiddenUsername = createInputNode({
          group: UiNodeGroupEnum.Password,
          attributes: {
            name: 'username',
            type: 'text',
            disabled: true,
            value: String(emailValue),
            autocomplete: 'username',
          },
          data: {
            style: {
              display: 'none',
            },
          },
        })
        nodes.unshift(hiddenUsername)
      }
      break
    }
    case UiNodeGroupEnum.LookupSecret: {
      const codesNode = nodes.find(
        (n): n is UiNodeText =>
          isUiNodeText(n) && n.attributes.id === 'lookup_secret_codes',
      )

      if (codesNode) {
        const ctx = codesNode.attributes.text.context as Record<
          string,
          unknown
        >

        const secrets: string[] = Array.isArray(ctx?.secrets)
          ? ctx.secrets.map((i: Record<string, unknown>) =>
              String(i.text ?? ''),
            )
          : []

        const codeNodes = secrets.map((code) =>
          createInputNode({
            group,
            attributes: {
              name: code,
              type: 'text',
              disabled: false,
              value: code,
            },
            data: {
              readOnly: true,
            },
          }),
        )

        const codesDiv = createDivGroup({
          id: `${group}-codes`,
          data: {
            variant: 'lookup-secrets-codes',
          },
          children: codeNodes,
        })

        nodes.splice(nodes.indexOf(codesNode), 1, ...codesDiv)
      }
      break
    }
  }

  settingsFooter(group, nodes, t)

  return createDivGroup({
    id: `${group}-card`,
    data: {
      type: 'Card',
    },
    children: nodes,
    group,
  })
}
