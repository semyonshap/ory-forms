import {
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributesOnclickTriggerEnum,
  UiNodeInputAttributesOnloadTriggerEnum,
  UiNodeAttributes,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import {
  allGroupEnums,
  authMethodPickerExcludedGroups,
  excludedAuthGroups,
  GroupedNodes,
  resendMessageId,
  UiNodeInput,
} from "../types"

export function triggerToWindowCall(
  trigger:
    | UiNodeInputAttributesOnclickTriggerEnum
    | UiNodeInputAttributesOnloadTriggerEnum
    | undefined,
): void {
  if (!trigger) return

  const fn = triggerToFunction(trigger)
  if (fn) {
    fn()
    return
  }

  // Retry every 100ms for 10 seconds
  let i = 0
  const ms = 100
  const interval = setInterval(() => {
    i++
    if (i > 100) {
      clearInterval(interval)
      throw new Error(
        "Unable to load Ory's WebAuthn script. Is it being blocked or otherwise failing to load? If you are running an old version of Ory Elements, please upgrade. For more information, please check your browser's developer console.",
      )
    }

    const fn = triggerToFunction(trigger)
    if (fn) {
      clearInterval(interval)
      fn()
    }
  }, ms)
}

export function triggerToFunction(
  trigger:
    | UiNodeInputAttributesOnclickTriggerEnum
    | UiNodeInputAttributesOnloadTriggerEnum,
): (() => void) | undefined {
  if (typeof window === "undefined") {
    console.debug(
      "The Ory SDK is missing a required function: window is undefined.",
    )
    return undefined
  }

  const typedWindow = window as unknown as Record<string, unknown>
  if (!(trigger in typedWindow) || typeof typedWindow[trigger] !== "function") {
    console.debug(`The Ory SDK is missing a required function: ${trigger}.`)
    return undefined
  }

  return typedWindow[trigger] as () => void
}

export function findScreenSelectionButton(
  nodes: UiNode[],
): { attributes: UiNodeInputAttributes } | undefined {
  return nodes.find(
    (node) =>
      node.attributes.node_type === "input" &&
      node.attributes.type === "submit" &&
      node.attributes.name === "screen",
  ) as { attributes: UiNodeInputAttributes }
}

type NodeType = UiNodeAttributes["node_type"]
type FindOptions<T extends NodeType = NodeType> = {
  node_type: T
  group?: UiNodeGroupEnum | RegExp
  id?: string | RegExp
  name?: string | RegExp
  type?: string | RegExp
}

const finder = (opt: FindOptions) => (n: UiNode) => {
  return (
    n.attributes.node_type === opt.node_type &&
    (opt.group
      ? opt.group instanceof RegExp
        ? n.group.match(opt.group)
        : n.group === opt.group
      : !opt.group) &&
    (opt.id && n.attributes.node_type !== "input"
      ? opt.id instanceof RegExp
        ? n.attributes.id.match(opt.id)
        : n.attributes.id === opt.id
      : !opt.id) &&
    (opt.name && n.attributes.node_type === "input"
      ? opt.name instanceof RegExp
        ? n.attributes.name.match(opt.name)
        : n.attributes.name === opt.name
      : !opt.name) &&
    (opt.type && n.attributes.node_type === "input"
      ? opt.type instanceof RegExp
        ? n.attributes.type.match(opt.type)
        : n.attributes.type === opt.type
      : !opt.type)
  )
}

export function findNode<T extends NodeType>(
  nodes: UiNode[],
  opt: FindOptions<T>,
): (UiNode & { attributes: UiNodeAttributes & { node_type: T } }) | undefined {
  return nodes.find(finder(opt)) as any
}

export function findCodeIdentifierNode(
  nodes: UiNode[],
): UiNodeInput | undefined {
  return (findNode(nodes, {
    group: "identifier_first",
    node_type: "input",
    name: "identifier",
  }) ??
    findNode(nodes, {
      group: "code",
      node_type: "input",
      name: "address",
    })) as UiNodeInput | undefined
}

export function nodesToAuthMethodGroups(
  nodes: UiNode[],
  excludeAuthMethods: UiNodeGroupEnum[] = [],
): UiNodeGroupEnum[] {
  const groups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}

  for (const node of nodes) {
    if (node.type === "script") continue
    const groupNodes = groups[node.group] ?? []
    groupNodes.push(node)
    groups[node.group] = groupNodes
  }

  const excludeSet = new Set([...excludedAuthGroups, ...excludeAuthMethods])
  return allGroupEnums.filter(
    (group) => groups[group]?.length && !excludeSet.has(group),
  )
}

export function hasSingleSignOnNodes(nodes: UiNode[]): boolean {
  return nodes.some(
    (node) =>
      node.group === UiNodeGroupEnum.Oidc ||
      node.group === UiNodeGroupEnum.Saml,
  )
}

export function withoutSingleSignOnNodes(nodes: UiNode[]): UiNode[] {
  return nodes.filter(
    (node) =>
      node.group !== UiNodeGroupEnum.Oidc &&
      node.group !== UiNodeGroupEnum.Saml,
  )
}

export function isUiNodeGroupEnum(method: string): method is UiNodeGroupEnum {
  return allGroupEnums.includes(method as UiNodeGroupEnum)
}

export function isNodeVisible(node: UiNode): node is UiNodeInput {
  if (isUiNodeScriptAttributes(node.attributes)) return false
  if (isUiNodeInputAttributes(node.attributes)) {
    if (node.attributes.type === "hidden") return false
  }
  return true
}

export function toAuthMethodPickerOptions(
  visibleGroups: GroupedNodes,
): UiNodeGroupEnum[] {
  return Object.values(UiNodeGroupEnum)
    .filter((group) => visibleGroups[group]?.length)
    .filter((group) => !authMethodPickerExcludedGroups.includes(group))
}

export function findResendNode(nodes: UiNode[]) {
  return nodes.find(
    (n) =>
      "name" in n.attributes &&
      ((["email", "recovery_confirm_address"].includes(n.attributes.name) &&
        n.attributes.type === "submit") ||
        n.attributes.name === "resend"),
  )
}

export function isIgnoredInputNode(node: UiNodeInput): boolean {
  return (
    node.meta.label?.id === resendMessageId ||
    ("name" in node.attributes && node.attributes.name === "screen") ||
    node.group === UiNodeGroupEnum.Oauth2Consent
  )
}
