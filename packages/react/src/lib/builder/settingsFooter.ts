import { TFunction } from 'i18next'
import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { createDivGroup, createTextNode, createUiText } from '../nodes/factory'
import { isUiNodeInput } from '../../types'

export function settingsFooter(group: UiNodeGroupEnum, nodes: UiNode[], t: TFunction) {
  let keyFooter

  if (group === UiNodeGroupEnum.Totp) {
    const unlink = nodes.find((n) => isUiNodeInput(n) && n.attributes.name === 'totp_unlink')
    keyFooter = unlink ? 'settings.totp.info.linked' : 'settings.totp.info.not-linked'
  } else {
    keyFooter = `settings.${group}.info`
  }

  const footerText = createUiText({
    keyOrId: keyFooter,
    text: '',
    t,
  })

  let textNode: UiNode | null = null
  if (footerText.text) {
    textNode = createTextNode({
      id: `${group}-footer-description`,
      text: footerText,
    })
  }

  const childrenSubmits: UiNode[] = []
  const submitIds = [1070003, 1050008, 1050011, 1050016, 1050007]

  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i]
    const id = n.meta.label?.id
    if (isUiNodeInput(n) && n.attributes.type === 'submit' && id && submitIds.includes(id)) {
      if (n.meta.label?.id === 1050016) {
        n.data = { ...n.data, variant: 'cancel' }
      }
      childrenSubmits.push(nodes.splice(i, 1)[0])
    }
  }

  const result: UiNode[] = []

  if (childrenSubmits.length > 0) {
    const submitGroup = createDivGroup({
      id: `${group}-footer`,
      data: { variant: 'footer-settings-submits' },
      children: childrenSubmits,
    })

    const footerGroup = createDivGroup({
      id: `${group}-footer`,
      data: { variant: 'footer-settings' },
      children: textNode ? [textNode, ...submitGroup] : [...submitGroup],
    })

    result.push(...footerGroup)
  } else if (textNode) result.push(textNode)

  nodes.push(...result)
}
