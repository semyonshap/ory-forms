import { TFunction } from 'i18next'
import { UiContainer } from '@ory/client-fetch'

import { hasCodeField, isCodeSent } from '../nodes'
import {
  collectParts,
  joinWithCommaOr,
  normalizeContext,
} from './headerHelpers'
import {
  HeaderOptions,
  HeaderLoginOptions,
  HeaderOAuth2ConsentOptions,
  HeaderOAuth2LogoutOptions,
  HeaderRegistrationOptions,
  OryFlowType,
  HeaderNavigationOptions,
} from '../../types'

export function getCardHeaderText(
  container: UiContainer,
  opts: HeaderOptions,
  t: TFunction,
): { title: string; description: string } {
  switch (opts.flowType) {
    case OryFlowType.Recovery:
      return getRecoveryHeader(container, t)
    case OryFlowType.Settings:
      return getSettingsHeader(t)
    case OryFlowType.Verification:
      return getVerificationHeader(container, t)
    case OryFlowType.Login:
      return getLoginHeader(container, opts, t)
    case OryFlowType.Registration:
      return getRegistrationHeader(container, opts, t)
    case OryFlowType.OAuth2Consent:
      return getConsentHeader(opts, t)
    case OryFlowType.Navigation:
      return getNavigationHeader(opts, t)
    case OryFlowType.Error:
      return getErrorHeader(t)
    case OryFlowType.OAuth2Logout:
      return getOAuth2LogoutHeader(opts, t)
    default:
      return getDefaultHeader(t)
  }
}

function getRecoveryHeader(container: UiContainer, t: TFunction) {
  const recoveryV2Message = container.messages?.find((m) =>
    [1060006, 1060005, 1060004].includes(m.id),
  )
  if (recoveryV2Message) {
    return {
      title: t('recovery.title'),
      description: t(
        `identities.messages.${recoveryV2Message.id}`,
        normalizeContext(recoveryV2Message.context),
      ),
    }
  }
  if (hasCodeField(container.nodes)) {
    return {
      title: t('recovery.title'),
      description: t('identities.messages.1060003'),
    }
  }
  return {
    title: t('recovery.title'),
    description: t('recovery.subtitle'),
  }
}

function getSettingsHeader(t: TFunction) {
  return {
    title: t('settings.title'),
    description: t('settings.subtitle'),
  }
}

function getVerificationHeader(container: UiContainer, t: TFunction) {
  if (hasCodeField(container.nodes)) {
    return {
      title: t('verification.title'),
      description: t('identities.messages.1080003'),
    }
  }
  return {
    title: t('verification.title'),
    description: t('verification.subtitle'),
  }
}

function getLoginHeader(
  container: UiContainer,
  opts: HeaderLoginOptions,
  t: TFunction,
) {
  const accountLinkingMessage = container.messages?.find(
    (m) => m.id === 1010016,
  )
  if (accountLinkingMessage) {
    return {
      title: t('account-linking.title'),
      description: t(
        `identities.messages.${accountLinkingMessage.id}`,
        normalizeContext(accountLinkingMessage.context),
      ),
    }
  }

  const parts = collectParts(container.nodes, opts.flowType, t)
  const orText = t('misc.or', 'or')
  const stringifiedParts = joinWithCommaOr(parts, orText)
  const codeSent = isCodeSent(container.nodes, opts.formState)

  if (opts.flow.refresh) {
    return {
      title: t('login.title-refresh'),
      description: codeSent
        ? t('identities.messages.1010025')
        : t('login.subtitle-refresh', { parts: stringifiedParts }),
    }
  }

  if (opts.flow.requested_aal === 'aal2') {
    let description = t('login.subtitle-aal2')
    if (codeSent) {
      description = t('identities.messages.1010025')
    } else if (
      opts.formState?.current === 'method_active' &&
      opts.formState.method
    ) {
      description = t(`login.${opts.formState.method}.subtitle`)
    }
    return {
      title: t('login.title-aal2'),
      description,
    }
  }

  return {
    title: t('login.title'),
    description:
      parts.length > 0
        ? codeSent
          ? t('identities.messages.1010014')
          : t('login.subtitle', { parts: stringifiedParts })
        : '',
  }
}

function getRegistrationHeader(
  container: UiContainer,
  opts: HeaderRegistrationOptions,
  t: TFunction,
) {
  const parts = collectParts(container.nodes, opts.flowType, t)
  const orText = t('misc.or', 'or')
  const codeSent = isCodeSent(container.nodes, opts.formState)

  return {
    title: t('registration.title'),
    description: codeSent
      ? t('identities.messages.1040005')
      : parts.length > 0
        ? t('registration.subtitle', {
            parts: joinWithCommaOr(parts, orText),
          })
        : '',
  }
}

function getOAuth2LogoutHeader(
  opts: HeaderOAuth2LogoutOptions,
  t: TFunction,
) {
  const description = t(
    'logout.subtitle',
    'Are you sure to logout {party}?',
    {
      party: opts.flow.logout_request?.client?.client_name || 'client',
    },
  )

  let postLogoutRedirectUri: string | null = null
  try {
    postLogoutRedirectUri =
      new URL(
        opts.flow.logout_request?.request_url ?? '',
      ).searchParams.get('post_logout_redirect_uri') || null
  } catch {
    /* ignore invalid url */
  }

  return {
    title: t('logout.title', 'Log out'),
    description: postLogoutRedirectUri
      ? `${description} ${t(
          'logout.redirect-notice',
          'You will be redirected to {url} after logging out.',
          { url: postLogoutRedirectUri },
        )}`
      : description,
  }
}

function getConsentHeader(opts: HeaderOAuth2ConsentOptions, t: TFunction) {
  return {
    title: t('consent.title', {
      party: opts.flow.consent_request?.client?.client_name,
    }),
    description: t('consent.subtitle', {
      identifier: opts.flow.session?.identity?.traits?.email ?? '',
    }),
  }
}

function getNavigationHeader(opts: HeaderNavigationOptions, t: TFunction) {
  const session = opts.flow.session
  const rawUser =
    session?.identity?.traits?.name?.first ??
    session?.identity?.traits?.username

  const user =
    typeof rawUser === 'string' && rawUser.trim() !== '' ? rawUser : 'User'

  if (opts.flow.session) {
    return {
      title: t(
        'navigation.header.authenticated.title',
        'Welcome back, {user}',
        { user },
      ),
      description: t(
        'navigation.header.authenticated.description',
        'Manage your account settings or sign out',
      ),
    }
  } else {
    return {
      title: t('navigation.header.guest.title', 'Get started'),
      description: t(
        'navigation.header.guest.description',
        'Sign in or create an account to continue',
      ),
    }
  }
}

function getErrorHeader(t: TFunction) {
  return {
    title: t('error.title.what-happened', 'What happened?'),
    description: t(
      'error.instructions',
      'Please try again in a few minutes or contact the website operator.',
    ),
  }
}

function getDefaultHeader(t: TFunction) {
  return {
    title: t('error.title', 'Error'),
    description: t('error.description', 'An error occurred'),
  }
}
