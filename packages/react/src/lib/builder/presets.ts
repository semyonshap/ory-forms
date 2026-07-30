import { UiNodeGroupEnum } from '@ory/client-fetch'

import { initFlowUrl } from '../../utils'
import { restartFlowUrl } from '../../utils'
import { BuildContext, NodeDataInput } from '../../types'
import {
  createAnchorNode,
  createInputNode,
  createDivGroup,
  createDivNode,
  createTextNode,
  createUiText,
} from '../nodes/factory'

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

export function BuildRecover({
  config,
  flowContainer: { flow },
  t,
  target,
}: BuildContext & { target?: string }) {
  return createAnchorNode({
    id: 'recover-anchor',
    href: initFlowUrl(config.sdk.url, 'recovery', flow),
    title: createUiText({
      keyOrId: 'forms.label.recover-account',
      text: 'Recover Account',
      t,
    }),
    data: { target, variant: 'link' },
  })
}

export function BuildForgotPassword({
  config,
  flowContainer: { flow },
  t,
  target,
}: BuildContext & { target?: string }) {
  return createAnchorNode({
    id: 'recover-anchor',
    href: initFlowUrl(config.sdk.url, 'recovery', flow),
    title: createUiText({
      keyOrId: 'forms.label.forgot-password',
      text: 'Forgot Password?',
      t,
    }),
    data: { target, variant: 'link' },
  })
}

export function BuildSelectMethod({
  t,
  extraData = {},
}: BuildContext & { extraData?: NodeDataInput }) {
  return createInputNode({
    attributes: {
      name: 'select-another-method',
      disabled: false,
      type: 'button',
    },
    data: {
      ...extraData,
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
    data: {
      variant: 'cancel',
    },
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

export function BuildCaptcha() {
  return createInputNode({
    attributes: {
      name: 'captcha_turnstile',
      type: 'hidden',
      value: '',
      disabled: false,
      required: true,
    },
    group: UiNodeGroupEnum.Captcha,
    meta: {
      label: createUiText({
        keyOrId: 0,
        text: 'Security verification',
      }),
    },
  })
}

export function BuildTransientPayload(payload: Record<string, unknown>) {
  return createInputNode({
    attributes: {
      name: 'transient_payload',
      type: 'hidden',
      value: JSON.stringify(payload),
      disabled: false,
    },
    group: UiNodeGroupEnum.Default,
    meta: {},
  })
}

function BuildReturnTo({
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
    returnTo = restartFlowUrl(
      flow,
      `${sdkUrl}/self-service/${flowType}/browser`,
    )
  }

  return returnTo
}
