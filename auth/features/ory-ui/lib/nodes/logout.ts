import { restartFlowUrl } from "../../utils"
import { BuildContext, FormState } from "../../types"
import { onLogout } from "../../hooks/useLogout"
import { LoginFlow } from "@ory/client-fetch"
import {
  createAnchorNode,
  createDivGroup,
  createTextNode,
  createUiText,
} from "./factory"

export function BuildReturnTo({
  config: {
    project: { default_redirect_url },
    sdk: { url: sdkUrl },
  },
  container: { flow, flowType },
}: BuildContext) {
  let returnTo = default_redirect_url

  if (flow.return_to) {
    returnTo = flow.return_to
  }

  if (!returnTo) {
    returnTo = restartFlowUrl(
      flow,
      `${sdkUrl}/self-service/${flowType}/browser`,
    )
  }

  return returnTo
}

export function BuildLogout(ctx: BuildContext) {
  const returnTo = BuildReturnTo(ctx)

  const { config, t } = ctx

  const { logoutFlow, didLoad } = onLogout(config)

  const nodeLogoutLabel = createTextNode({
    id: "logout-label",
    text: createUiText({
      keyOrId: "login.2fa.go-back",
      text: "Something isn't working?",
      t,
    }),
  })

  const isLogoutReady = !didLoad || logoutFlow

  const nodeAnchorLogout = createAnchorNode({
    id: "logout-anchor",
    href: logoutFlow ? logoutFlow?.logout_url : returnTo,
    title: createUiText({
      keyOrId: isLogoutReady
        ? "login.registration-button"
        : "login.2fa.go-back.link",
      text: isLogoutReady ? "Sign up" : "Go back",
      t,
    }),
  })

  return createDivGroup({
    id: "registration-div",
    class: "inline-flex",
    children: [nodeLogoutLabel, nodeAnchorLogout],
  })
}

export function showLogout(
  flow: LoginFlow,
  formState: FormState,
  authMethods: string[],
) {
  if (flow.refresh) {
    return true
  }

  if (flow.requested_aal === "aal2") {
    if (formState.current === "select_method") {
      return true
    }
    if (formState.current === "method_active" && flow.active === "code") {
      return true
    }
    if (formState.current === "method_active" && authMethods.length === 1) {
      return true
    }
  }
  return false
}
