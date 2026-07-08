import { OAuth2ConsentRequest, UiNode, UiTextTypeEnum } from "@ory/client-fetch"

import { buildActionUrl } from "./utils"
import { getServerSession } from "./session"
import { serverSideOAuth2Client } from "./client"
import { ConsentFlow, QueryParams } from "../types"
import { redirect } from "next/navigation"

export async function getConsentFlow(
  params: QueryParams | Promise<QueryParams>,
  baseUrl: string,
  loginUiUrl: string,
): Promise<ConsentFlow | null> {
  const resolved = await params
  const consentChallenge = resolved["consent_challenge"]?.toString()

  if (!consentChallenge) {
    return null
  }

  const api = serverSideOAuth2Client()

  let consentRequest: OAuth2ConsentRequest
  try {
    consentRequest = await api.getOAuth2ConsentRequest({ consentChallenge })
  } catch {
    return null
  }

  if (consentRequest.skip) {
    const accept = await api.acceptOAuth2ConsentRequest({
      consentChallenge,
      acceptOAuth2ConsentRequest: {
        grant_scope: consentRequest.requested_scope ?? [],
        grant_access_token_audience:
          consentRequest.requested_access_token_audience ?? [],
        session: {},
      },
    })
    redirect(accept.redirect_to)
  }

  const session = await getServerSession()
  if (!session) {
    const loginUrl = buildActionUrl(baseUrl, loginUiUrl, {
      login_challenge: resolved["login_challenge"]?.toString(),
    })
    redirect(loginUrl)
  }

  return {
    consentRequest,
    ui: {
      action: buildActionUrl(baseUrl, "/self-service/consent", {
        consent_challenge: consentChallenge,
      }),
      method: "POST",
      nodes: [
        ...scopesToUiNodes(consentRequest.requested_scope ?? []),
        rememberCheckbox,
        rejectButton,
        acceptButton,
        challengeNode(consentRequest.challenge),
      ],
      messages: [],
    },
  }
}

function scopesToUiNodes(scopes: string[]): UiNode[] {
  return scopes.map((scope) => ({
    type: "input",
    group: "oauth2_consent",
    meta: {
      label: {
        id: 9999111,
        text: scope,
        type: UiTextTypeEnum.Info,
      },
    },
    attributes: {
      node_type: "input",
      name: `grant_scope`,
      value: scope,
      type: "checkbox",
      disabled: false,
    },
    messages: [],
  }))
}

function challengeNode(challenge: string): UiNode {
  return {
    type: "input",
    group: "oauth2_consent",
    meta: {},
    attributes: {
      node_type: "input",
      name: "consent_challenge",
      value: challenge,
      type: "hidden",
      disabled: false,
    },
    messages: [],
  }
}
const rememberCheckbox: UiNode = {
  type: "input",
  group: "oauth2_consent",
  meta: {
    label: {
      id: 9999111,
      text: "Remember my decision",
      type: UiTextTypeEnum.Info,
    },
  },
  attributes: {
    node_type: "input",
    name: "remember",
    value: false,
    type: "checkbox",
    disabled: false,
  },
  messages: [],
}
const acceptButton: UiNode = {
  type: "input",
  group: "oauth2_consent",
  meta: {
    label: {
      id: 9999111,
      text: "Accept",
      type: UiTextTypeEnum.Info,
    },
  },
  attributes: {
    node_type: "input",
    name: "action",
    value: "accept",
    type: "submit",
    disabled: false,
  },
  messages: [],
}
const rejectButton: UiNode = {
  type: "input",
  group: "oauth2_consent",
  meta: {
    label: {
      id: 9999111,
      text: "Reject",
      type: UiTextTypeEnum.Info,
    },
  },
  attributes: {
    node_type: "input",
    name: "action",
    value: "reject",
    type: "submit",
    disabled: false,
  },
  messages: [],
}
