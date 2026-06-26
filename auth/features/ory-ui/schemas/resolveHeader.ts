// auth/features/ory-ui/schemas/resolveHeader.ts

import {
  FlowType,
  isUiNodeInputAttributes,
  UiContainer,
} from "@ory/client-fetch"
import { HeaderNode, UiNodeEnhanced } from "../types"

function joinWithCommaOr(list: string[], orText = "or"): string {
  if (list.length === 0) return "."
  if (list.length === 1) return list[0]
  const last = list.pop()
  return `${list.join(", ")} ${orText} ${last}`
}

// Hardcoded default English messages (copied from Ory's defaultMessage)
const TITLES: Record<string, string> = {
  recovery: "Recover your account",
  settings: "Account Settings",
  verification: "Verify your account",
  login: "Sign in",
  registration: "Register an account",
  "account-linking": "Link account",
  "login-refresh": "Reauthenticate",
  "login-aal2": "Second factor authentication",
  consent: "Authorize {party}",
}

const DESCRIPTIONS: Record<string, string> = {
  recovery:
    "Enter the identifier associated with your account to receive a one-time access code",
  "recovery-code-sent":
    "An email containing a recovery code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.",
  settings: "Update your account settings",
  verification:
    "Enter the email address associated with your account to verify it",
  "verification-code-sent":
    "An email containing a verification code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.",
  "login-subtitle": "Sign in with {parts}",
  "login-subtitle-refresh": "Confirm your identity with {parts}",
  "login-subtitle-aal2":
    "Choose a way to complete your second factor authentication",
  "login-code-sent":
    "A code was sent to your address. If you didn't receive it, please try again.",
  "registration-subtitle": "Sign up with {parts}",
  "registration-code-sent":
    "A code has been sent to the address(es) you provided. If you have not received a message, check the spelling of the address and retry the registration.",
  "consent-subtitle":
    "A third party application wants to access information associated with your account {identifier}.",
  "account-linking-description":
    'You tried to sign in with "{duplicateIdentifier}", but that email is already used by another account. Sign in to your account with one of the options below to add your account "{duplicateIdentifier}" at "{provider}" as another way to sign in.',
  "default-error": "An error occurred",
}

// Helper to get a node's label text (simplified – you can use resolveLabel from Ory if needed)
function getNodeLabelText(node: any): string | undefined {
  if (node.meta?.label?.text) return node.meta.label.text
  if (node.attributes?.label?.text) return node.attributes.label.text
  return undefined
}

// Helper to check if a group exists among visible nodes
function hasGroup(nodes: UiNodeEnhanced[], group: string): boolean {
  return nodes.some((n) => n.group === group && n.ui?.visible !== false)
}

// Helper to check if a node with a given name exists (and is visible)
function hasNodeWithName(nodes: UiNodeEnhanced[], name: string): boolean {
  return nodes.some(
    (n) =>
      n.ui?.visible !== false &&
      "name" in n.attributes &&
      n.attributes.name === name,
  )
}

export function resolveHeader(
  enhancedNodes: UiNodeEnhanced[],
  flowType: FlowType,
  flow: any, // includes refresh, requested_aal, messages, etc.
  formState?: any,
  container?: UiContainer,
): HeaderNode | null {
  const nodes = enhancedNodes
  const messages = container?.messages || []

  // ---- Recovery ----
  if (flowType === FlowType.Recovery) {
    const recoveryV2Message = messages.find((m: any) =>
      [1060006, 1060005, 1060004].includes(m.id),
    )
    if (recoveryV2Message) {
      return {
        kind: "header",
        ui: {
          title: TITLES.recovery,
          description: recoveryV2Message.text || TITLES.recovery,
          messageId: String(recoveryV2Message.id),
        },
      }
    } else if (hasNodeWithName(nodes, "code")) {
      return {
        kind: "header",
        ui: {
          title: TITLES.recovery,
          description: DESCRIPTIONS["recovery-code-sent"],
          messageId: "1060003",
        },
      }
    }
    return {
      kind: "header",
      ui: {
        title: TITLES.recovery,
        description: DESCRIPTIONS.recovery,
      },
    }
  }

  // ---- Settings ----
  if (flowType === FlowType.Settings) {
    return {
      kind: "header",
      ui: {
        title: TITLES.settings,
        description: DESCRIPTIONS.settings,
      },
    }
  }

  // ---- Verification ----
  if (flowType === FlowType.Verification) {
    if (hasNodeWithName(nodes, "code")) {
      return {
        kind: "header",
        ui: {
          title: TITLES.verification,
          description: DESCRIPTIONS["verification-code-sent"],
          messageId: "1080003",
        },
      }
    }
    return {
      kind: "header",
      ui: {
        title: TITLES.verification,
        description: DESCRIPTIONS.verification,
      },
    }
  }

  // ---- Login ----
  if (flowType === FlowType.Login) {
    // Account linking
    const accountLinkingMessage = messages.find((m: any) => m.id === 1010016)
    if (accountLinkingMessage) {
      return {
        kind: "header",
        ui: {
          title: TITLES["account-linking"],
          description:
            accountLinkingMessage.text ||
            DESCRIPTIONS["account-linking-description"],
          messageId: "1010016",
        },
      }
    }

    // Build parts (list of authentication methods)
    const parts: string[] = []
    if (hasGroup(nodes, "password")) {
      parts.push("your email and password")
    }
    if (hasGroup(nodes, "oidc") || hasGroup(nodes, "saml")) {
      parts.push("a social provider")
    }
    if (hasGroup(nodes, "code")) {
      parts.push("a one-time code")
    }
    if (hasGroup(nodes, "totp")) {
      parts.push("your authenticator app")
    }
    if (hasGroup(nodes, "lookup_secret")) {
      parts.push("a backup recovery code")
    }
    if (hasGroup(nodes, "passkey")) {
      parts.push("a Passkey")
    }
    if (hasGroup(nodes, "webauthn")) {
      parts.push("a security key")
    }

    // If identifier_first or profile, we can try to get a custom label
    let identifierLabel = "email"
    if (hasGroup(nodes, "identifier_first")) {
      const identifierNode = nodes.find(
        (n) =>
          isUiNodeInputAttributes(n.attributes) &&
          n.attributes.name.startsWith("identifier") &&
          n.attributes.type !== "hidden",
      )
      if (identifierNode) {
        const label = getNodeLabelText(identifierNode)
        if (label) identifierLabel = label
      }
    } else if (hasGroup(nodes, "profile")) {
      const identifierNode = nodes.find(
        (n) =>
          isUiNodeInputAttributes(n.attributes) &&
          n.attributes.name.startsWith("traits.") &&
          n.attributes.type !== "hidden",
      )
      if (identifierNode) {
        const label = getNodeLabelText(identifierNode)
        if (label) identifierLabel = label
      }
    }

    // For password we hardcoded "your email and password" – but if we have identifierLabel, we could use it.
    // We can replace "email" with the actual label in the parts.
    if (hasGroup(nodes, "password")) {
      // Replace the hardcoded "email" with the actual label if available
      const passwordPart = `your ${identifierLabel} and password`
      const index = parts.indexOf("your email and password")
      if (index !== -1) {
        parts[index] = passwordPart
      }
    }

    const codeSent =
      hasNodeWithName(nodes, "code") &&
      formState?.current === "method_active" &&
      formState?.method === "code"

    const stringifiedParts = joinWithCommaOr(parts, "or")

    if (flow.refresh) {
      const description = codeSent
        ? DESCRIPTIONS["login-code-sent"]
        : DESCRIPTIONS["login-subtitle-refresh"].replace(
            "{parts}",
            stringifiedParts,
          )
      return {
        kind: "header",
        ui: {
          title: TITLES["login-refresh"],
          description,
          messageId: codeSent ? "1010025" : undefined,
        },
      }
    } else if (flow.requested_aal === "aal2") {
      let description: string
      if (codeSent) {
        description = DESCRIPTIONS["login-code-sent"]
        return {
          kind: "header",
          ui: {
            title: TITLES["login-aal2"],
            description,
            messageId: "1010025",
          },
        }
      } else if (formState?.current === "method_active" && formState?.method) {
        const methodSubtitles: Record<string, string> = {
          code: "A verification code will be sent by email",
          webauthn: "Please prepare your WebAuthN device",
          totp: "Please enter the code generated by your Authenticator App",
          lookup_secret:
            "Please enter one of your 8-digit backup recovery codes",
        }
        description =
          methodSubtitles[formState.method] ||
          DESCRIPTIONS["login-subtitle-aal2"]
      } else {
        description = DESCRIPTIONS["login-subtitle-aal2"]
      }
      return {
        kind: "header",
        ui: {
          title: TITLES["login-aal2"],
          description,
        },
      }
    } else {
      // Regular login
      const description =
        parts.length > 0
          ? codeSent
            ? DESCRIPTIONS["login-code-sent"]
            : DESCRIPTIONS["login-subtitle"].replace(
                "{parts}",
                stringifiedParts,
              )
          : ""
      return {
        kind: "header",
        ui: {
          title: TITLES.login,
          description,
        },
      }
    }
  }

  if (flowType === FlowType.Registration) {
    const codeSent =
      hasNodeWithName(nodes, "code") &&
      formState?.current === "method_active" &&
      formState?.method === "code"

    const parts: string[] = []
    if (hasGroup(nodes, "password")) {
      let identifierLabel = "email"
      const identifierNode = nodes.find(
        (n) =>
          isUiNodeInputAttributes(n.attributes) &&
          n.attributes.name.startsWith("traits.") &&
          n.attributes.type !== "hidden",
      )
      if (identifierNode) {
        const label = getNodeLabelText(identifierNode)
        if (label) identifierLabel = label
      }
      parts.push(`your ${identifierLabel} and a password`)
    }
    if (hasGroup(nodes, "oidc") || hasGroup(nodes, "saml")) {
      parts.push("a social provider")
    }
    if (hasGroup(nodes, "code")) {
      parts.push("a one-time code")
    }

    const stringifiedParts = joinWithCommaOr(parts, "or")
    const description = codeSent
      ? DESCRIPTIONS["registration-code-sent"]
      : parts.length > 0
        ? DESCRIPTIONS["registration-subtitle"].replace(
            "{parts}",
            stringifiedParts,
          )
        : ""

    return {
      kind: "header",
      ui: {
        title: TITLES.registration,
        description,
      },
    }
  }

  if (flowType === FlowType.OAuth2Consent) {
    const clientName =
      flow.consent_request?.client?.client_name || "the application"
    const identifier = flow.session?.identity?.traits?.email || ""
    const title = TITLES.consent.replace("{party}", clientName)
    const description = DESCRIPTIONS["consent-subtitle"].replace(
      "{identifier}",
      identifier,
    )
    return {
      kind: "header",
      ui: {
        title,
        description,
      },
    }
  }

  return {
    kind: "header",
    ui: {
      title: "Error",
      description: DESCRIPTIONS["default-error"],
    },
  }
}
