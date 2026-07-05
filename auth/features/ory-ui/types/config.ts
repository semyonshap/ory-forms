import {
  AccountExperienceConfiguration,
  ConfigurationParameters,
  FrontendApi,
} from "@ory/client-fetch"

export interface OryClientConfiguration {
  sdk?: {
    url?: string
    options?: Partial<ConfigurationParameters>
  }
  project: AccountExperienceConfiguration
}

export interface OryConfiguration {
  sdk: {
    url: string
    options?: Partial<ConfigurationParameters>
    frontend: FrontendApi
  }
  project: AccountExperienceConfiguration
}
