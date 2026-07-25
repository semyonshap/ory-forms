import { LoginFlow, LogoutFlow } from '@ory/client-fetch'

import { initFlowUrl } from '../../utils'
import { BuildContext, isUiNodeInput, FormState, BuilderLogoutFlow } from '../../types'
import { restartFlowUrl } from '../../utils'

import {
  createAnchorNode,
  createInputNode,
  createDivGroup,
  createDivNode,
  createTextNode,
  createUiText,
} from './factory'

export function BuildSignUp({
  config: {
    sdk: { url: sdkUrl },
  },
  flowContainer: { flow },
  t,
}: BuildContext) {
  const nodeTextSignUpLabel = createTextNode({
    id: 'registration-label',
    text: createUiText({
      keyOrId: 'login.registration-label',
      text: "Don't have an account?",
      t,
    }),
  })

  const nodeAnchorSignUp = createAnchorNode({
    id: 'registration-button',
    href: initFlowUrl(sdkUrl, 'registration', flow),
    title: createUiText({
      keyOrId: 'login.registration-button',
      text: 'Sign up',
      t,
    }),
    data: {
      variant: 'link',
    },
  })

  return createDivGroup({
    id: 'registration-div',
    data: { variant: 'footer' },
    children: [nodeTextSignUpLabel, nodeAnchorSignUp],
  })
}

export function BuildDivider() {
  return createDivNode({
    id: `divider-${crypto.randomUUID()}`,
    data: {
      type: 'DividerCard',
    },
  })
}

export function BuildRecover({ config, flowContainer: { flow }, t }: BuildContext) {
  const identifierNode = flow.ui.nodes
    .filter(isUiNodeInput)
    .find((n) => n.attributes.name === 'identifier')

  if (!identifierNode) return null

  return createAnchorNode({
    id: 'recover-anchor',
    href: initFlowUrl(config.sdk.url, 'recovery', flow),
    title: createUiText({
      keyOrId: 'forms.label.recover-account',
      text: 'Recover Account',
      t,
    }),
    data: { target: identifierNode.attributes.name, variant: 'link' },
  })
}

export function BuildForgotPassword({ config, flowContainer: { flow }, t }: BuildContext) {
  const passwordNode = flow.ui.nodes
    .filter(isUiNodeInput)
    .find((n) => n.attributes.type === 'password')

  if (!passwordNode) return null

  return createAnchorNode({
    id: 'recover-anchor',
    href: initFlowUrl(config.sdk.url, 'recovery', flow),
    title: createUiText({
      keyOrId: 'forms.label.forgot-password',
      text: 'Forgot Password?',
      t,
    }),
    data: { target: passwordNode.attributes.name, variant: 'link' },
  })
}

export function BuildChooseMethod({
  onClick,
  t,
}: BuildContext & {
  onClick: () => void
}) {
  return createInputNode({
    attributes: {
      name: 'choose-method-button',
      type: 'button',
      disabled: false,
    },
    data: {
      onClick,
      variant: 'link',
    },
    meta: {
      label: createUiText({
        keyOrId: 'login.2fa.method.go-back',
        text: 'Choose another method',
        t,
      }),
    },
  })
}

export function BuildSelectAnother({
  onClick,
  t,
}: BuildContext & {
  onClick: () => void
}) {
  return createInputNode({
    attributes: {
      name: 'select-another-button',
      disabled: false,
      type: 'button',
    },
    data: {
      onClick,
      variant: 'link',
    },
    meta: {
      label: createUiText({
        keyOrId: 'card.footer.select-another-method',
        text: 'Select another method',
        t,
      }),
    },
  })
}

export function BuildGoBackCode(ctx: BuildContext) {
  const returnTo = BuildReturnTo(ctx)

  const { t } = ctx

  return createAnchorNode({
    id: 'go-back-anchor',
    href: returnTo,
    title: createUiText({
      keyOrId: 'login.2fa.go-back.link',
      text: 'Go back',
      t,
    }),
  })
}

export function BuildSignIn({
  config: {
    sdk: { url: sdkUrl },
  },
  flowContainer: { flow },
  t,
}: BuildContext) {
  const nodeTextSignInLabel = createTextNode({
    id: 'login-label',
    text: createUiText({
      keyOrId: 'registration.login-label',
      text: 'Already have an account?',
      t,
    }),
  })

  const nodeAnchorSignIn = createAnchorNode({
    id: 'login-button',
    href: initFlowUrl(sdkUrl, 'login', flow),
    title: createUiText({
      keyOrId: 'registration.login-button',
      text: 'Sign in',
      t,
    }),
    data: {
      variant: 'link',
    },
  })

  return createDivGroup({
    id: 'login-div',
    children: [nodeTextSignInLabel, nodeAnchorSignIn],
  })
}

export function BuildReturnTo({
  config: {
    project: { default_redirect_url },
    sdk: { url: sdkUrl },
  },
  flowContainer: { flow, flowType },
}: BuildContext) {
  let returnTo = default_redirect_url

  if (flow.return_to) {
    returnTo = flow.return_to
  }

  if (!returnTo) {
    returnTo = restartFlowUrl(flow, `${sdkUrl}/self-service/${flowType}/browser`)
  }

  return returnTo
}

export function BuildLogout(ctx: BuildContext, logoutCtx: BuilderLogoutFlow) {
  const returnTo = BuildReturnTo(ctx)

  const { t } = ctx

  const nodeLogoutLabel = createTextNode({
    id: 'logout-label',
    text: createUiText({
      keyOrId: 'login.2fa.go-back',
      text: "Something isn't working?",
      t,
    }),
  })

  const { logoutFlow, logoutLoading } = logoutCtx

  const isLogoutReady = !logoutLoading || logoutFlow

  const nodeAnchorLogout = createAnchorNode({
    id: 'logout-anchor',
    href: logoutFlow ? logoutFlow?.logout_url : returnTo,
    title: createUiText({
      keyOrId: isLogoutReady ? 'login.registration-button' : 'login.2fa.go-back.link',
      text: isLogoutReady ? 'Sign up' : 'Go back',
      t,
    }),
  })

  return createDivGroup({
    id: 'registration-div',
    data: { variant: 'footer' },
    children: [nodeLogoutLabel, nodeAnchorLogout],
  })
}

export function showLogout(flow: LoginFlow, formState: FormState, authMethods: string[]) {
  if (flow.refresh) {
    return true
  }

  if (flow.requested_aal === 'aal2') {
    if (formState.current === 'select_method') {
      return true
    }
    if (formState.current === 'method_active' && flow.active === 'code') {
      return true
    }
    if (formState.current === 'method_active' && authMethods.length === 1) {
      return true
    }
  }
  return false
}
