import { useCard } from '../../hooks'
import { WrapperDiv } from '../../types'
import { useFlowStore } from '../../context'
import React from 'react'

export function DivWrapper({ node, attached }: WrapperDiv) {
  const Main = useFlowStore((state) => state.components.Card)

  const { props, options } = useCard(node)

  const type = node.data?.type

  if (!type && Main.Div)
    return <Main.Div node={node} attached={attached} options={{ variant: node.data?.variant }} />
  else if (type === 'DividerCard') {
    if (Main.Divider) return <Main.Divider node={node} />
    else return null
  } else if (type === 'Card') {
    return <Main.Card node={node} attached={attached} props={props} options={options} />
  } else {
    return <React.Fragment children={attached} />
  }
}
