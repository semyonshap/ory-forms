import { UiNodeInputAttributesTypeEnum } from '@ory/client-fetch'

import {
  NodeRender,
  ignoredScriptGroups,
  isUiNodeAnchor,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeScript,
  isUiNodeText,
  NodeRenderInput,
  isUiNodeDiv,
} from '../types'
import { useFlowStoreShallow } from '../context'

import { ButtonWrapper, AnchorWrapper, TextWrapper, ImageWrapper, InputWrapper } from './wrappers'
import { NodeScript } from './nodes/script'
import { DivWrapper } from './wrappers/divWrapper'
import { CheckboxWrapper } from './wrappers/inputWrapper'

export const Node = ({ node, attached }: NodeRender) => {
  if (isUiNodeDiv(node)) return DivWrapper({ node, attached })
  else if (isUiNodeImage(node)) return ImageWrapper({ node, attached })
  else if (isUiNodeText(node)) return TextWrapper({ node, attached })
  else if (isUiNodeAnchor(node)) return AnchorWrapper({ node, attached })
  else if (isUiNodeInput(node)) return <NodeInput node={node} attached={attached} />
  else if (isUiNodeScript(node) && !ignoredScriptGroups.includes(node.group))
    return <NodeScript node={node} />
  return null
}

function NodeInput({ node, attached }: NodeRenderInput) {
  const {
    components: { Node },
  } = useFlowStoreShallow((state) => ({
    components: state.components,
  }))

  const { attributes } = node
  switch (attributes.type) {
    case UiNodeInputAttributesTypeEnum.Checkbox:
      return CheckboxWrapper({ node, attached })
    case UiNodeInputAttributesTypeEnum.Button:
    case UiNodeInputAttributesTypeEnum.Submit:
      return ButtonWrapper({ node, attached })
    default: {
      const options = node.attributes.options
      if (Array.isArray(options) && options.length > 0 && Node.Select)
        return <Node.Select node={node} />

      return InputWrapper({ node, attached })
    }
  }
}
