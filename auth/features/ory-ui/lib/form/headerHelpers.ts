import { TFunction } from "i18next"
import { UiNode } from "@ory/client-fetch"
import { isUiNodeInputAttributes } from "@ory/client-fetch"

import { resolveLabel } from "../../i18n"

export function joinWithCommaOr(list: string[], orText = "or"): string {
  if (list.length === 0) return "."
  if (list.length === 1) return list[0]
  const copy = [...list]
  const last = copy.pop()!
  return `${copy.join(", ")} ${orText} ${last}`
}

export function normalizeContext(context: unknown): Record<string, unknown> {
  return context && typeof context === "object"
    ? (context as Record<string, unknown>)
    : {}
}

export function collectParts(
  nodes: UiNode[],
  flowType: string,
  t: TFunction,
): string[] {
  const parts: string[] = []

  if (nodes.find((node) => node.group === "password")) {
    const key =
      flowType === "registration"
        ? "card.header.parts.password.registration"
        : "card.header.parts.password.login"
    parts.push(t(key, { identifierLabel: "email" })) // TODO: dynamic
  }

  if (nodes.find((node) => node.group === "oidc" || node.group === "saml")) {
    parts.push(t("card.header.parts.oidc"))
  }
  if (nodes.find((node) => node.group === "code")) {
    parts.push(t("card.header.parts.code"))
  }
  if (nodes.find((node) => node.group === "totp")) {
    parts.push(t("card.header.parts.totp"))
  }
  if (nodes.find((node) => node.group === "lookup_secret")) {
    parts.push(t("card.header.parts.lookup_secret"))
  }
  if (nodes.find((node) => node.group === "passkey")) {
    parts.push(t("card.header.parts.passkey"))
  }
  if (nodes.find((node) => node.group === "webauthn")) {
    parts.push(t("card.header.parts.webauthn"))
  }

  // identifier_first
  const identifierFirstNode = nodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.name.startsWith("identifier") &&
      node.attributes.type !== "hidden",
  )
  if (identifierFirstNode) {
    parts.push(
      t("card.header.parts.identifier-first", {
        identifierLabel:
          identifierFirstNode.meta.label &&
          resolveLabel(identifierFirstNode.meta.label, t),
      }),
    )
  }

  // profile
  const profileNode = nodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.name.startsWith("traits.") &&
      node.attributes.type !== "hidden",
  )
  if (profileNode) {
    parts.push(
      t("card.header.parts.identifier-first", {
        identifierLabel:
          profileNode.meta.label && resolveLabel(profileNode.meta.label, t),
      }),
    )
  }

  return parts
}
