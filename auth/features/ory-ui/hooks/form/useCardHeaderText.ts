import { isUiNodeInputAttributes, UiContainer } from "@ory/client-fetch"
import { useTranslation } from "react-i18next"

import { findNode } from "../../lib/nodes"
import { resolveLabel } from "../../i18n"
import { CardHeaderTextOptions, OryFlowType } from "../../types"

function joinWithCommaOr(list: string[], orText = "or"): string {
  if (list.length === 0) {
    return "."
  } else if (list.length === 1) {
    return list[0]
  } else {
    const last = list.pop()
    return `${list.join(", ")} ${orText} ${last}`
  }
}

function normalizeContext(context: unknown): Record<string, unknown> {
  if (context && typeof context === "object") {
    return context as Record<string, unknown>
  }
  return {}
}

export function useCardHeaderText(
  container: UiContainer,
  opts: CardHeaderTextOptions,
): { title: string; description: string } {
  const { t } = useTranslation()
  const nodes = container.nodes

  switch (opts.flowType) {
    case OryFlowType.Recovery: {
      const recoveryV2Message = container.messages?.find((m) =>
        [1060006, 1060005, 1060004].includes(m.id),
      )

      if (recoveryV2Message) {
        return {
          title: t("recovery.title"),
          description: t(
            `identities.messages.${recoveryV2Message.id}`,
            normalizeContext(recoveryV2Message.context),
          ),
        }
      } else if (
        nodes.find(
          (node) =>
            "name" in node.attributes && node.attributes.name === "code",
        )
      ) {
        return {
          title: t("recovery.title"),
          description: t("identities.messages.1060003"),
        }
      }
      return {
        title: t("recovery.title"),
        description: t("recovery.subtitle"),
      }
    }

    case OryFlowType.Settings:
      return {
        title: t("settings.title"),
        description: t("settings.subtitle"),
      }

    case OryFlowType.Verification:
      if (
        nodes.find(
          (node) =>
            "name" in node.attributes && node.attributes.name === "code",
        )
      ) {
        return {
          title: t("verification.title"),
          description: t("identities.messages.1080003"),
        }
      }
      return {
        title: t("verification.title"),
        description: t("verification.subtitle"),
      }

    case OryFlowType.Login: {
      // account linking
      const accountLinkingMessage = container.messages?.find(
        (m) => m.id === 1010016,
      )
      if (accountLinkingMessage) {
        return {
          title: t("account-linking.title"),
          description: t(
            `identities.messages.${accountLinkingMessage.id}`,
            normalizeContext(accountLinkingMessage.context),
          ),
        }
      }
      break
    }
  }

  const parts: string[] = []

  if (nodes.find((node) => node.group === "password")) {
    switch (opts.flowType) {
      case OryFlowType.Registration:
        parts.push(
          t("card.header.parts.password.registration", {
            identifierLabel: "email", // TODO: сделать динамическим
          }),
        )
        break
      default:
        parts.push(
          t("card.header.parts.password.login", {
            identifierLabel: "email",
          }),
        )
    }
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

  if (nodes.find((node) => node.group === "identifier_first")) {
    const identifier = nodes.find(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.name.startsWith("identifier") &&
        node.attributes.type !== "hidden",
    )

    if (identifier) {
      parts.push(
        t("card.header.parts.identifier-first", {
          identifierLabel:
            identifier.meta.label && resolveLabel(identifier.meta.label, t),
        }),
      )
    }
  }

  if (nodes.some((node) => node.group === "profile")) {
    const identifier = nodes.find(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.name.startsWith("traits.") &&
        node.attributes.type !== "hidden",
    )

    if (identifier) {
      parts.push(
        t("card.header.parts.identifier-first", {
          identifierLabel:
            identifier.meta.label && resolveLabel(identifier.meta.label, t),
        }),
      )
    }
  }

  const orText = t("misc.or", "or")
  const stringifiedParts = joinWithCommaOr(parts, orText)

  switch (opts.flowType) {
    case OryFlowType.Login: {
      const codeMethodNode = findNode(container.nodes, {
        node_type: "input",
        group: "code",
        name: "code",
        type: "text",
      })
      const codeSent =
        codeMethodNode &&
        opts.formState?.current === "method_active" &&
        opts.formState?.method === "code"

      if (opts.flow.refresh) {
        const description = codeSent
          ? t("identities.messages.1010025")
          : t("login.subtitle-refresh", { parts: stringifiedParts })
        return {
          title: t("login.title-refresh"),
          description,
        }
      } else if (opts.flow.requested_aal === "aal2") {
        let description = t("login.subtitle-aal2")
        if (codeSent) {
          description = t("identities.messages.1010025")
        } else if (
          opts.formState?.current === "method_active" &&
          opts.formState.method
        ) {
          description = t(`login.${opts.formState.method}.subtitle`)
        }
        return {
          title: t("login.title-aal2"),
          description,
        }
      }

      const description =
        parts.length > 0
          ? codeSent
            ? t("identities.messages.1010014")
            : t("login.subtitle", { parts: stringifiedParts })
          : ""
      return {
        title: t("login.title"),
        description,
      }
    }

    case OryFlowType.Registration: {
      const codeMethodNode = findNode(container.nodes, {
        node_type: "input",
        group: "code",
        name: "code",
        type: "text",
      })
      const codeSent =
        codeMethodNode &&
        opts.formState?.current === "method_active" &&
        opts.formState?.method === "code"

      return {
        title: t("registration.title"),
        description: codeSent
          ? t("identities.messages.1040005")
          : parts.length > 0
            ? t("registration.subtitle", {
                parts: joinWithCommaOr(parts, orText),
              })
            : "",
      }
    }

    case OryFlowType.OAuth2Consent:
      return {
        title: t("consent.title", {
          party: opts.flow.consent_request.client?.client_name,
        }),
        description: t("consent.subtitle", {
          identifier: opts.flow.session.identity?.traits?.email ?? "",
        }),
      }

    default:
      return {
        title: t("error.title", "Error"),
        description: t("error.description", "An error occurred"),
      }
  }
}
