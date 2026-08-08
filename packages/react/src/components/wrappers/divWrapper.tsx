import React from 'react'

import { useCard } from '../../hooks'
import { WrapperDiv } from '../../types'
import { useStoreClient, useFlowStoreShallow } from '../../context'

export function DivWrapper({ node, children, attached }: WrapperDiv) {
  const store = useStoreClient()

  const { Layout } = useFlowStoreShallow((s) => ({
    Layout: s.components.Layout,
  }))

  const { props, options } = useCard(node)

  const type = node.data?.type

  if (!type && Layout.Div)
    return (
      <Layout.Div
        node={node}
        options={{ variant: node.data?.variant }}
        store={store}
        attached={attached}
      >
        {children}
      </Layout.Div>
    )
  else if (type === 'DividerCard') {
    if (Layout.Divider) return <Layout.Divider node={node} store={store} />
    else return null
  } else if (type === 'Card') {
    return (
      <Layout.Card
        node={node}
        props={props}
        options={options}
        store={store}
        attached={attached}
      >
        {children}
      </Layout.Card>
    )
  } else {
    return <React.Fragment>{children}</React.Fragment>
  }
}
