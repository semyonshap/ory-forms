import React from 'react'

import { renderNodes } from '../render'
import { useFlowStoreShallow } from '../../context'
import {
  useFormMessages,
  useFormNodes,
  useWebAuthnLoader,
  useFlowFormState,
} from '../../hooks'

export function FormWrapper() {
  const {
    flowContainer: { flowType },
    Form,
  } = useFlowStoreShallow((state) => ({
    flowContainer: state.flowContainer,
    Form: state.components.Layout.Form,
  }))

  useFlowFormState()

  useWebAuthnLoader()

  const nodes = useFormNodes()
  const result = renderNodes(nodes)

  const Component = Form ?? React.Fragment

  const messages = useFormMessages()

  return <Component options={{ flowType, messages }}>{result}</Component>
}
