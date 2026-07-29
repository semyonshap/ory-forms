import React from 'react'

import { renderNodes } from '../render'
import {
  useFormMessages,
  useFormNodes,
  useWebAuthnLoader,
} from '../../hooks'
import { useFlowStoreShallow } from '../../context'

export function FormWrapper() {
  const {
    Form,
    flowContainer: { flowType },
  } = useFlowStoreShallow((state) => ({
    flowContainer: state.flowContainer,
    Form: state.components.Layout.Form,
  }))

  useWebAuthnLoader()

  const nodes = useFormNodes()
  const result = renderNodes(nodes)

  const Component = Form ?? React.Fragment

  const messages = useFormMessages()

  return <Component options={{ flowType, messages }}>{result}</Component>
}
