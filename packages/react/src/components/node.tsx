import {
  UiNodeInputAttributesTypeEnum,
} from '@ory/client-fetch'

import { NodeScript } from './nodeScript'
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
import {
  WrapperBase,
  ignoredScriptGroups,
  isUiNodeAnchor,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeScript,
  isUiNodeText,
  WrapperInput,
  isUiNodeDiv,
} from '../types'

export const Node = ({ node, attached }: WrapperBase) => {
  if (isUiNodeDiv(node)) return DivWrapper({ node, attached })
  else if (isUiNodeImage(node)) return ImageWrapper({ node, attached })
  else if (isUiNodeText(node)) return TextWrapper({ node, attached })
  else if (isUiNodeAnchor(node)) return AnchorWrapper({ node, attached })
  else if (isUiNodeInput(node))
    return <NodeInput node={node} attached={attached} />
  else if (
    isUiNodeScript(node) &&
    !ignoredScriptGroups.includes(node.group)
  ) {
    return <NodeScript node={node} />
  }
  return null
}

function NodeInput({ node, attached }: WrapperInput) {
  const { attributes } = node

  if (attributes.name === 'captcha_turnstile_options') {
    return <CaptchaWrapper node={node} attached={attached} />
  }

  switch (attributes.type) {
    case UiNodeInputAttributesTypeEnum.Checkbox:
      return CheckboxWrapper({ node, attached })
    case UiNodeInputAttributesTypeEnum.Button:
    case UiNodeInputAttributesTypeEnum.Submit:
      return ButtonWrapper({ node, attached })
    default:
      return InputWrapper({ node, attached })
  }
}
