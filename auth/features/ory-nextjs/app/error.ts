import { QueryParams } from "../types"
import { serverSideFrontendClient } from "./client"
import { FlowError } from "@ory/client-fetch"

export async function getError(
  searchParams: QueryParams | Promise<QueryParams>,
): Promise<{ error: string; error_description: string } | FlowError> {
  const params = await searchParams
  if ("error" in params) {
    return {
      error: params["error"] as string,
      error_description:
        (params["error_description"] as string | undefined) ??
        "An unknown error occurred.",
    }
  }

  const id = params["id"]?.toString() ?? ""
  if (!id) {
    return {
      error: "unknown_error",
      error_description: "An unknown error occurred.",
    }
  }

  try {
    return await serverSideFrontendClient().getFlowError({ id })
  } catch (error) {
    return {
      error: "unknown_error",
      error_description:
        error instanceof Error ? error.message : "An unknown error occurred.",
    }
  }
}
