import {
  UiNodeGroupEnum,
  UiNodeInputAttributesTypeEnum,
} from '@ory/client-fetch'

import { NodeScript } from './nodeScript'
import {
  WrapperBase,
  isUiNodeAnchor,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeScript,
  isUiNodeText,
  WrapperInput,
  isUiNodeDiv,
} from '../types'
import {
  CaptchaWrapper,
  CheckboxWrapper,
  DivWrapper,
  ButtonWrapper,
  AnchorWrapper,
  TextWrapper,
  ImageWrapper,
  InputWrapper,
} from './wrappers'

export const Node = ({ node, children, attached }: WrapperBase) => {
  const { group } = node

  if (group === UiNodeGroupEnum.Captcha) {
    if (isUiNodeScript(node)) return null
    return (
      <CaptchaWrapper node={node} attached={attached}>
        {children}
      </CaptchaWrapper>
    )
  }

  if (isUiNodeDiv(node)) return DivWrapper({ node, children, attached })
  else if (isUiNodeImage(node))
    return ImageWrapper({ node, children, attached })
  else if (isUiNodeText(node))
    return TextWrapper({ node, children, attached })
  else if (isUiNodeAnchor(node))
    return AnchorWrapper({ node, children, attached })
  else if (isUiNodeInput(node))
    return (
      <NodeInput node={node} attached={attached}>
        {children}
      </NodeInput>
    )
  else if (isUiNodeScript(node)) return <NodeScript node={node} />

  return null
}

function NodeInput({ node, children, attached }: WrapperInput) {
  const { attributes } = node

  switch (attributes.type) {
    case UiNodeInputAttributesTypeEnum.Checkbox:
      return CheckboxWrapper({ node, children, attached })
    case UiNodeInputAttributesTypeEnum.Button:
    case UiNodeInputAttributesTypeEnum.Submit:
      return ButtonWrapper({ node, children, attached })
    default:
      return InputWrapper({ node, children, attached })
  }
}
