"use server"

import { getServerSession } from "./session"
import { serverSideFrontendClient } from "./client"
import { ErrorFlow, OryError, QueryParams } from "../types"
import {
  instanceOfFlowError,
  instanceOfGenericError,
  UiNode,
} from "@ory/client-fetch"
import { createUiText } from "../utils/factory"
import { getLogoutFlow } from "./logout"
import { createNavigationNode } from "../utils/presets"
import { upperFirst } from "lodash-es"

export async function getErrorFlow(
  config: { project: { default_redirect_url: string } },
  searchParams: QueryParams | Promise<QueryParams>,
): Promise<ErrorFlow> {
  const params = await searchParams

  const error = await getError(params)

  const session = await getServerSession()

  const result: UiNode[] = []

  if (session) {
    const logoutFlow = await getLogoutFlow()
    result.push(createNavigationNode("logout", logoutFlow.logout_url))
  }

  result.push(
    createNavigationNode("go_back", config.project.default_redirect_url),
  )

  const messageDescription = createUiText({
    id: 9999111,
    text: getDescription(error),
    type: "error",
  })

  const messageDetails = createUiText({
    id: 9999111,
    text: `Details: ${JSON.stringify(error, null, 2)}`,
  })

  return {
    id: error.id ?? "UNSET",
    active: "error",
    session,
    error,
    ui: {
      action: "#",
      method: "GET",
      nodes: result,
      messages: [messageDescription, messageDetails],
    },
  }
}

function getDescription(error: OryError) {
  const { message, code } = error
  if (message) return upperFirst(message)

  const statusClass = Math.floor(code / 100)
  switch (statusClass) {
    case 4:
      return "The server could not handle your request, because it was malformed"
    case 5:
      return "The server encountered an error and could not complete your request"
    default:
      return "An unexpected error occurred"
  }
}

export async function getError(searchParams: QueryParams): Promise<OryError> {
  const params = searchParams

  if ("error" in params) {
    return {
      code: 400,
      message:
        (params["error_description"] as string | undefined) ??
        "An unknown error occurred.",
      status: params["error"] as string,
      timestamp: new Date(),
    }
  }

  const id = params["id"]?.toString()
  if (!id) {
    return {
      code: 500,
      message: "An unknown error occurred.",
      status: "unknown_error",
      timestamp: new Date(),
    }
  }

  const error = await serverSideFrontendClient()
    .getFlowError({ id })
    .then((res) => {
      const error = res.error

      if (res && instanceOfFlowError(res)) {
        const parsed = error as OryError
        return {
          ...parsed,
          id: res.id,
          timestamp: res.created_at,
        }
      }

      if (error && instanceOfGenericError(error)) {
        return {
          id: id,
          code: error.code ?? 500,
          message: error.message,
          status: error.status,
          reason: error.reason,
          timestamp: new Date(),
        }
      }

      return {
        code: 500,
        message: "No error details provided",
        status: "unknown_error",
        timestamp: new Date(),
      }
    })
    .catch((error) => {
      return {
        code: 500,
        message:
          error instanceof Error ? error.message : "An unknown error occurred.",
        status: "unknown_error",
        timestamp: new Date(),
      }
    })

  return error
}
