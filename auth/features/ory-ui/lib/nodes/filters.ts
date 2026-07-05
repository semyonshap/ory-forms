import { UiNode } from "@ory/client-fetch"

export function findResendNode(nodes: UiNode[]) {
  return nodes.find(
    (n) =>
      "name" in n.attributes &&
      ((["email", "recovery_confirm_address"].includes(n.attributes.name) &&
        n.attributes.type === "submit") ||
        n.attributes.name === "resend"),
  )
}

export function isResendNode(node: UiNode): boolean {
  if (!("attributes" in node)) return false
  const attrs = node.attributes
  if (!("name" in attrs)) return false

  const name = attrs.name
  return (
    name === "resend" ||
    (["email", "recovery_confirm_address"].includes(name) &&
      attrs.type === "submit")
  )
}
