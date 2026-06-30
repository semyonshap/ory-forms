import {
  isUiNodeInputAttributes,
  UiNode,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import { defaultGroupOrder, defaultNodeOrder } from "../types"

const Slot = {
  Inputs: 0,
  Checkboxes: 1,
  Captcha: 2,
  Buttons: 3,
}

function isUiNodeButton(node: UiNode) {
  return (
    isUiNodeInputAttributes(node.attributes) &&
    (node.attributes.type === "submit" || node.attributes.type === "button")
  )
}

function makeUiNodeComparator({ groupOrder = defaultNodeOrder } = {}) {
  const groupRank = new Map(groupOrder.map((g, i) => [g, i]))
  const unknownGroupRank = groupOrder.length

  const slotRank = (node: UiNode) => {
    if (isUiNodeInputAttributes(node.attributes) === false) {
      return Slot.Inputs
    }
    const { type } = node.attributes

    if (node.group === "webauthn" && type !== "submit" && type !== "button") {
      return Slot.Buttons
    }

    if (type === "checkbox") {
      return Slot.Checkboxes
    }

    if (node.group === "captcha") {
      return Slot.Captcha
    }

    if (type === "submit" || type === "button") {
      return Slot.Buttons
    }

    return Slot.Inputs
  }

  return (a: UiNode, b: UiNode) => {
    const sa = slotRank(a)
    const sb = slotRank(b)
    if (sa !== sb) {
      return sa - sb
    }

    const ga = groupRank.get(a.group) ?? unknownGroupRank
    const gb = groupRank.get(b.group) ?? unknownGroupRank
    if (ga !== gb) {
      return ga - gb
    }

    if (a.group === "webauthn" && b.group === "webauthn") {
      const aIsButton = isUiNodeButton(a)
      const bIsButton = isUiNodeButton(b)
      if (aIsButton !== bIsButton) {
        return aIsButton ? 1 : -1
      }
    }

    return 0
  }
}

export const defaultNodeSorter = makeUiNodeComparator({
  groupOrder: defaultNodeOrder,
})

export function defaultGroupSorter(
  a: UiNodeGroupEnum,
  b: UiNodeGroupEnum,
): number {
  const aGroupWeight = defaultGroupOrder.indexOf(a) ?? 999
  const bGroupWeight = defaultGroupOrder.indexOf(b) ?? 999

  return aGroupWeight - bGroupWeight
}
