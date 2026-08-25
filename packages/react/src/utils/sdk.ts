import {
  Configuration,
  ConfigurationParameters,
  FrontendApi,
  JSONApiResponse,
} from '@ory/client-fetch'

import type {
  OAuth2ConsentFlowResponse,
  OAuth2LogoutFlowResponse,
  UpdateOAuth2ConsentFlowBody,
  UpdateOAuth2LogoutFlowBody,
} from '../types'

declare module '@ory/client-fetch' {
  interface FrontendApi {
    updateOAuth2ConsentFlowRaw(
      requestParameters: {
        updateOAuth2ConsentFlowBody: UpdateOAuth2ConsentFlowBody
      },
      initOverrides?: RequestInit,
    ): Promise<JSONApiResponse<OAuth2ConsentFlowResponse>>
    updateOAuth2LogoutFlowRaw(
      requestParameters: {
        updateOAuth2LogoutFlowBody: UpdateOAuth2LogoutFlowBody
      },
      initOverrides?: RequestInit,
    ): Promise<JSONApiResponse<OAuth2LogoutFlowResponse>>
  }
}

export class OryFrontendApi extends FrontendApi {
  async updateOAuth2ConsentFlowRaw(
    requestParameters: {
      updateOAuth2ConsentFlowBody: UpdateOAuth2ConsentFlowBody
    },
    initOverrides?: RequestInit,
  ): Promise<JSONApiResponse<OAuth2ConsentFlowResponse>> {
    const headerParameters: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const response = await this.request(
      {
        path: '/custom-service/consent',
        method: 'POST',
        headers: headerParameters,
        body: requestParameters.updateOAuth2ConsentFlowBody,
      },
      initOverrides,
    )

    return new JSONApiResponse(
      response,
      (jsonValue) => jsonValue as OAuth2ConsentFlowResponse,
    )
  }

  async updateOAuth2LogoutFlowRaw(
    requestParameters: {
      updateOAuth2LogoutFlowBody: UpdateOAuth2LogoutFlowBody
    },
    initOverrides?: RequestInit,
  ): Promise<JSONApiResponse<OAuth2LogoutFlowResponse>> {
    const headerParameters: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const response = await this.request(
      {
        path: '/custom-service/logout',
        method: 'POST',
        headers: headerParameters,
        body: requestParameters.updateOAuth2LogoutFlowBody,
      },
      initOverrides,
    )

    return new JSONApiResponse(
      response,
      (jsonValue) => jsonValue as OAuth2LogoutFlowResponse,
    )
  }
}

export function frontendClient(
  sdkUrl: string,
  opts: Partial<ConfigurationParameters> = {},
) {
  const config = new Configuration({
    ...opts,
    basePath: sdkUrl.replace(/\/$/, ''),
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  return new OryFrontendApi(config)
}
