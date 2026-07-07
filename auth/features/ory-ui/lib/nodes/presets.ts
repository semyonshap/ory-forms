import { initFlowUrl } from "../../utils"
import { BuildContext, isUiNodeInput } from "../../types"
import { BuildReturnTo } from "./logout"
import {
  createAnchorNode,
  createButtonNode,
  createDivGroup,
  createTextNode,
  createUiText,
} from "./factory"

export function BuildSignUp({
  config: {
    sdk: { url: sdkUrl },
  },
  container: { flow },
  t,
}: BuildContext) {
  const nodeTextSignUpLabel = createTextNode({
    id: "registration-label",
    text: createUiText({
      keyOrId: "login.registration-label",
      text: "Don't have an account?",
      t,
    }),
  })

  const nodeAnchorSignUp = createAnchorNode({
    id: "registration-button",
    href: initFlowUrl(sdkUrl, "registration", flow),
    title: createUiText({
      keyOrId: "login.registration-button",
      text: "Sign up",
      t,
    }),
  })

  return createDivGroup({
    id: "registration-div",
    class: "inline-flex gap-2",
    div_type: "Div",
    children: [nodeTextSignUpLabel, nodeAnchorSignUp],
  })
}

export function BuildRecover({ config, container: { flow }, t }: BuildContext) {
  const identifierNode = flow.ui.nodes
    .filter(isUiNodeInput)
    .find((n) => n.attributes.name === "identifier")

  if (!identifierNode) return null

  return createAnchorNode({
    id: "recover-anchor",
    href: initFlowUrl(config.sdk.url, "recovery", flow),
    title: createUiText({
      keyOrId: "forms.label.recover-account",
      text: "Recover Account",
      t,
    }),
    data: { target: identifierNode.attributes.name },
  })
}

export function BuildForgotPassword({
  config,
  container: { flow },
  t,
}: BuildContext) {
  const passwordNode = flow.ui.nodes
    .filter(isUiNodeInput)
    .find((n) => n.attributes.type === "password")

  if (!passwordNode) return null

  return createAnchorNode({
    id: "recover-anchor",
    href: initFlowUrl(config.sdk.url, "recovery", flow),
    title: createUiText({
      keyOrId: "forms.label.forgot-password",
      text: "Forgot Password?",
      t,
    }),
    data: { target: passwordNode.attributes.name },
  })
}

export function BuildChooseMethod({
  onClick,
  t,
}: BuildContext & {
  onClick: () => void
}) {
  return createButtonNode({
    name: "choose-method-button",
    onClick,
    data: {
      inputType: "link",
    },
    label: createUiText({
      keyOrId: "login.2fa.method.go-back",
      text: "Choose another method",
      t,
    }),
  })
}

export function BuildSelectAnother({
  onClick,
  t,
}: BuildContext & {
  onClick: () => void
}) {
  return createButtonNode({
    name: "select-another-button",
    onClick,
    data: {
      inputType: "link",
    },
    label: createUiText({
      keyOrId: "card.footer.select-another-method",
      text: "Select another method",
      t,
    }),
  })
}

export function BuildGoBackCode(ctx: BuildContext) {
  const returnTo = BuildReturnTo(ctx)

  const { t } = ctx

  return createAnchorNode({
    id: "go-back-anchor",
    href: returnTo,
    title: createUiText({
      keyOrId: "login.2fa.go-back.link",
      text: "Go back",
      t,
    }),
  })
}

export function BuildSignIn({
  config: {
    sdk: { url: sdkUrl },
  },
  container: { flow },
  t,
}: BuildContext) {
  const nodeTextSignInLabel = createTextNode({
    id: "login-label",
    text: createUiText({
      keyOrId: "registration.login-label",
      text: "Already have an account?",
      t,
    }),
  })

  const nodeAnchorSignIn = createAnchorNode({
    id: "login-button",
    href: initFlowUrl(sdkUrl, "login", flow),
    title: createUiText({
      keyOrId: "registration.login-button",
      text: "Sign in",
      t,
    }),
  })

  return createDivGroup({
    id: "login-div",
    class: "inline-flex gap-2",
    div_type: "Div",
    children: [nodeTextSignInLabel, nodeAnchorSignIn],
  })
}
