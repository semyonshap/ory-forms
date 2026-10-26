import { ComponentType } from 'react'
import {
  AccountExperienceConfigurationLocaleBehaviorEnum,
  ConfigurationParameters,
  OnRedirectHandler,
  RevisionAccountExperienceCustomTranslation,
  UiNode,
  UiNodeGroupEnum,
} from '@ory/client-fetch'

import { BuildContext } from './build'
import { OryFrontendApi } from '../utils/sdk'
import { OryFlowContainer, FormNode, UiNodeFixed, FlowFormState } from '.'
import {
  OrySuccessHandler,
  OryValidationErrorHandler,
  OryErrorHandler,
} from './event'
import {
  BlockInput,
  BlockImage,
  BlockText,
  BlockAnchor,
  BlockLabel,
  BlockButton,
  IconProps,
  BlockCard,
  BlockDivider,
  BlockCheckbox,
  BlockForm,
  BlockDiv,
  BlockCaptcha,
} from './blocks'

export interface FormValues {
  [key: string]:
    string | boolean | number | string[] | undefined | FormValues
}

export type SetExtraNodes = (
  config: OryConfiguration,
  formState: FlowFormState,
) => UiNodeFixed[]

export interface FlowInputProps {
  flow: OryFlowContainer
  config: OryClientConfiguration
  components?: Partial<OryClientComponents>
  transientPayload?: FormValues
  setExtraNodes?: SetExtraNodes
  onSuccess?: OrySuccessHandler
  onValidationError?: OryValidationErrorHandler
  onError?: OryErrorHandler
  onRedirect?: OnRedirectHandler
}

export type NodeSorter = (
  a: UiNode,
  b: UiNode,
  ctx: { flowType: string },
) => number

export type GroupSorter = (
  a: UiNodeGroupEnum,
  b: UiNodeGroupEnum,
) => number

export type NodeFilter = (node: FormNode, ctx: BuildContext) => boolean

export interface OryComponents {
  Layout: {
    Card: ComponentType<BlockCard>
    Divider?: ComponentType<BlockDivider>
    Form?: ComponentType<BlockForm>
    Div?: ComponentType<BlockDiv>
  }
  Node: {
    Label: ComponentType<BlockLabel>
    Button: ComponentType<BlockButton>
    Anchor: ComponentType<BlockAnchor>
    Text: ComponentType<BlockText>
    Checkbox: ComponentType<BlockCheckbox>
    Image: ComponentType<BlockImage>
    Input: ComponentType<BlockInput>
    Captcha?: ComponentType<BlockCaptcha>
    AuthMethod?: ComponentType<BlockButton>
    Resend?: ComponentType<BlockButton>
    Oidc?: ComponentType<BlockButton>
    Code?: ComponentType<BlockInput>
    Password?: ComponentType<BlockInput>
  }
  Icons: {
    Providers: {
      Apple: ComponentType<IconProps>
      Auth0: ComponentType<IconProps>
      Discord: ComponentType<IconProps>
      Facebook: ComponentType<IconProps>
      Github: ComponentType<IconProps>
      Gitlab: ComponentType<IconProps>
      Google: ComponentType<IconProps>
      Linkedin: ComponentType<IconProps>
      Microsoft: ComponentType<IconProps>
      Slack: ComponentType<IconProps>
      Spotify: ComponentType<IconProps>
      X: ComponentType<IconProps>
      Yandex: ComponentType<IconProps>
    }
    System?: {
      Password?: ComponentType<IconProps>
      Code?: ComponentType<IconProps>
      CodeAsterix?: ComponentType<IconProps>
      Passkey?: ComponentType<IconProps>
      Webauthn?: ComponentType<IconProps>
      Totp?: ComponentType<IconProps>
      LookupSecret?: ComponentType<IconProps>
      HardwareToken?: ComponentType<IconProps>

      Openid?: ComponentType<IconProps>
      OfflineAccess?: ComponentType<IconProps>
      Profile?: ComponentType<IconProps>
      Email?: ComponentType<IconProps>
      Address?: ComponentType<IconProps>
      Phone?: ComponentType<IconProps>
    }
  }
  nodeSorter: NodeSorter
  groupSorter: GroupSorter
  nodeFilter: NodeFilter
}

// Config

export type OryClientComponents = {
  Layout: OryComponents['Layout']
  Node: Partial<OryComponents['Node']>
  Icons?: {
    Providers?: Partial<OryComponents['Icons']['Providers']>
    System?: Partial<OryComponents['Icons']['System']>
  }
} & Partial<
  Pick<OryComponents, 'nodeSorter' | 'groupSorter' | 'nodeFilter'>
>

export interface OryProject {
  name: string
  default_locale: string
  enabled_locales: string[]
  locale_behavior: AccountExperienceConfigurationLocaleBehaviorEnum
  translations: RevisionAccountExperienceCustomTranslation[]

  default_redirect_url: string

  login_ui_url: string
  registration_ui_url: string
  recovery_ui_url: string
  verification_ui_url: string
  settings_ui_url: string
  error_ui_url: string

  oauth2_login_ui_url?: string
  oauth2_consent_ui_url?: string
  oauth2_logout_ui_url?: string
}

export interface OryClientConfiguration {
  sdk?: {
    url?: string
    options?: Partial<ConfigurationParameters>
  }
  project: OryProject
}

export interface OryConfiguration {
  sdk: {
    url: string
    options?: Partial<ConfigurationParameters>
    frontend: OryFrontendApi
  }
  project: OryProject
}
