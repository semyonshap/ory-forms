import { useTranslation } from 'react-i18next'
import { getNodeLabel, UiNodeAnchorAttributes } from '@ory/client-fetch'

import { omitInputAttributes } from '../utils'
import {
  BlockOptionsAnchor,
  BlockPropsAnchor,
  UiNodeAnchor,
} from '../types'
import { uiTextToFormattedMessage } from '../i18n'

export function useAnchor(node: UiNodeAnchor): {
  props: BlockPropsAnchor
  options: BlockOptionsAnchor
} {
  const { t } = useTranslation()

  const props = omitInputAttributes<UiNodeAnchorAttributes>(
    node.attributes,
  )
  const label = getNodeLabel(node)
  const formattedLabel = label && uiTextToFormattedMessage(label, t)

  return {
    props,
    options: {
      label: formattedLabel,
      variant: node.data?.variant || 'button',
    },
  }
}
