import get from 'lodash-es/get'
import set from 'lodash-es/set'
import {
  isUiNodeInputAttributes,
  UiNode,
  UiNodeGroupEnum,
} from '@ory/client-fetch'

import { getNodesByGroups, groupNodes } from '../nodes'
import { removeEmptyStrings } from './removeFalsyValues'
import { FormValues, relationGroups } from '../../types'

export function filterData({
  data,
  nodes,
  transientPayload,
}: {
  nodes: UiNode[]
  data: FormValues
  transientPayload?: FormValues
}): FormValues {
  const method = data.method as UiNodeGroupEnum

  console.log('Initial data', data)

  if (method === UiNodeGroupEnum.Code && data.code) {
    data.resend = ''
  }

  const cleanData = removeEmptyStrings<FormValues>(data)

  const result: FormValues = { method }

  console.log('nodes', nodes)

  const { groupsNodes } = groupNodes({ nodes })

  const fields = getNodesByGroups({
    groupsNodes,
    groups: [
      method,
      UiNodeGroupEnum.Default,
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

  if (transientPayload) {
    result.transient_payload = transientPayload
  }

  console.log('Filtered data', result)

  return result
}
