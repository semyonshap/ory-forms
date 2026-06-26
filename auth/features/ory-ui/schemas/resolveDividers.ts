import { UiNodeGroupEnum } from "@ory/client-fetch"
import { UiNodeEnhanced, DividerNode, RenderNode } from "../types"

function isSocialGroup(group: string): boolean {
  return group === UiNodeGroupEnum.Oidc || group === UiNodeGroupEnum.Saml
}

function isLocalMethodGroup(group: string): boolean {
  const methodGroups: string[] = [
    UiNodeGroupEnum.Password,
    UiNodeGroupEnum.Code,
    UiNodeGroupEnum.Totp,
    UiNodeGroupEnum.LookupSecret,
    UiNodeGroupEnum.Passkey,
    UiNodeGroupEnum.Webauthn,
  ]
  return methodGroups.includes(group)
}

export function resolveDividers(enhancedNodes: UiNodeEnhanced[]): RenderNode[] {
  const hasSocial = enhancedNodes.some(
    (n) => isSocialGroup(n.group) && (n.ui?.visible ?? true),
  )
  const hasLocal = enhancedNodes.some(
    (n) => isLocalMethodGroup(n.group) && (n.ui?.visible ?? true),
  )

  if (!hasSocial || !hasLocal) {
    return enhancedNodes
  }

  let lastSocialIndex = -1
  for (let i = 0; i < enhancedNodes.length; i++) {
    if (isSocialGroup(enhancedNodes[i].group)) {
      lastSocialIndex = i
    }
  }

  const result: RenderNode[] = [...enhancedNodes]
  const divider: DividerNode = { kind: "divider" }
  result.splice(lastSocialIndex + 1, 0, divider)
  return result
}
