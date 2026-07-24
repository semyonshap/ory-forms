import {
  AccountExperienceConfiguration,
  ConfigurationParameters,
  FrontendApi,
} from '@ory/client-fetch'

export type OryProject = AccountExperienceConfiguration & {
  oauth2_login_ui_url: string
  oauth2_consent_ui_url: string
  oauth2_logout_ui_url: string
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
    frontend: FrontendApi
  }
  project: OryProject
}
