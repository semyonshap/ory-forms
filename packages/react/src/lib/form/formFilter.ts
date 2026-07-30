import get from 'lodash-es/get'
import set from 'lodash-es/set'
import {
  isUiNodeInputAttributes,
  UiNodeGroupEnum,
} from '@ory/client-fetch'

import { getNodesByGroups, groupNodes } from '../nodes'
import { removeEmptyStrings } from './removeFalsyValues'
import { FormValues, OryFlowContainer, relationGroups } from '../../types'

export function filterData(
  data: FormValues,
  flowContainer: OryFlowContainer,
): FormValues {
  const method = data.method as UiNodeGroupEnum
  const cleanData = removeEmptyStrings<FormValues>(data)

  const nodes = flowContainer.flow.ui.nodes

  const { groupsNodes } = groupNodes({ nodes })
  const result: FormValues = { method }

  if (data.csrf_token) result.csrf_token = data.csrf_token
  if (data.transient_payload)
    result.transient_payload = data.transient_payload

  const fields = getNodesByGroups({
    groupsNodes,
    groups: [
      UiNodeGroupEnum.Default,
      method,
      ...(relationGroups[method] ?? []),
    ],
  })

  for (const field of fields) {
    const attr = field.attributes
    if (!isUiNodeInputAttributes(attr)) continue
    const { name } = attr
    const value = get(cleanData, name)
    if (value !== undefined) {
      set(result, name, value)
    }
  }

  return result
}
