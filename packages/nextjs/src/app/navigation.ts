"use server"

import { UiNode } from "@ory/client-fetch"

import { getLogoutFlow } from "./logout"
import { NavigationFlow } from "../types"
import { getServerSession } from "./session"
import { createNavigationNode } from "../utils/presets"

export async function getNavigationFlow(config: {
  project: {
    login_ui_url: string
    registration_ui_url: string
    verification_ui_url: string
    recovery_ui_url: string
    settings_ui_url: string
  }
}): Promise<NavigationFlow | null> {
  const {
    login_ui_url,
    recovery_ui_url,
    registration_ui_url,
    settings_ui_url,
    verification_ui_url,
  } = config.project

  const session = await getServerSession()
  const result: UiNode[] = []

  if (session) {
    const { identity } = session

    if (identity && !identity.verifiable_addresses) {
      result.push(createNavigationNode("verification", verification_ui_url))
    }

    const logoutFlow = await getLogoutFlow()

    result.push(
      createNavigationNode("settings", settings_ui_url),
      createNavigationNode("logout", logoutFlow.logout_url),
    )
  } else {
    result.push(
      createNavigationNode("login", login_ui_url),
      createNavigationNode("registration", registration_ui_url),
      createNavigationNode("recovery", recovery_ui_url),
    )
  }

  return {
    id: "UNSET",
    active: "navigation",
    session,
    ui: {
      action: "#",
      method: "GET",
      nodes: result,
      messages: [],
    },
  }
}
