import {
  toBody,
  FetchError,
  isCsrfError,
  ContinueWith,
  GenericError,
  ResponseError,
  verificationUrl,
  isResponseError,
  isAddressNotVerified,
  isSelfServiceFlowReplaced,
  isSelfServiceFlowExpiredError,
  isNeedsPrivilegedSessionError,
  isBrowserLocationChangeRequired,
} from '@ory/client-fetch'

import { FlowErrorHandlerProps } from '../types'

export class CaptchaRequiredError extends Error {}

export const handleFlowError =
  <T>(opts: FlowErrorHandlerProps<T>) =>
  async (err: unknown): Promise<void | T> => {
    if (!isResponseError(err)) {
      if (isFetchError(err)) {
        throw new FetchError(
          err,
          'Unable to call the API endpoint. Ensure that CORS is set up correctly and that you have provided a valid SDK URL to Ory Elements.',
        )
      }
      throw err
    }
    const body = await toBody(err.response)

    const contentType = err.response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      if (await handleJsonError(body, opts)) return
      if (await handleStatusError(err, body, opts)) return

      const msg = JSON.stringify(body)
      if (msg.includes('cf_turnstile_response') || msg.includes('captcha')) {
        throw new CaptchaRequiredError()
      }

      throw new ResponseError(
        err.response,
        'The Ory API endpoint returned a response code the SDK does not know how to handle. Please check the network tab for more information. Received response: ' +
          (await err.response.json()),
      )
    } else if (
      contentType.includes('text/') ||
      contentType.includes('html') ||
      contentType.includes('xml')
    ) {
      await logResponseError(err.response, true)
      throw new ResponseError(
        err.response,
        `The Ory API endpoint returned an unexpected HTML or text response. Check your console output for details.`,
      )
    }

    await logResponseError(err.response, false)

    throw new ResponseError(
      err.response,
      'The Ory API endpoint returned unexpected content type `' +
        contentType +
        '`.  Check your console output for details.',
    )
  }

async function handleJsonError<T>(body: unknown, opts: FlowErrorHandlerProps<T>) {
  if (isSelfServiceFlowExpiredError(body)) {
    await opts.onError?.({
      type: 'flow_expired',
      flowType: opts.flowType,
      body,
    })
    opts.onRestartFlow(body.use_flow_id)
    return true
  } else if (isAddressNotVerified(body)) {
    const errBody = body as {
      error: { details?: { continue_with?: [ContinueWith] } }
    }

    for (const continueWith of errBody.error.details?.continue_with || []) {
      if (continueWith.action === 'show_verification_ui' && continueWith.flow.url) {
        opts.onRedirect(continueWith.flow.url, true)
        return true
      }
    }

    opts.onRedirect(verificationUrl(opts.config), true)
    return true
  } else if (isBrowserLocationChangeRequired(body) && body.redirect_browser_to) {
    opts.onRedirect(body.redirect_browser_to, true)
    return true
  } else if (isNeedsPrivilegedSessionError(body) && body.redirect_browser_to) {
    opts.onRedirect(body.redirect_browser_to, true)
    return true
  } else if (isSelfServiceFlowReplaced(body)) {
    await opts.onError?.({
      type: 'flow_replaced',
      flowType: opts.flowType,
      body,
    })
    opts.onRestartFlow()
    return true
  } else if (isCsrfError(body)) {
    await opts.onError?.({
      type: 'csrf_error',
      flowType: opts.flowType,
      body,
    })
    opts.onRestartFlow()
    return true
  }

  return false
}

async function handleStatusError<T>(
  err: ResponseError,
  body: unknown,
  opts: FlowErrorHandlerProps<T>,
) {
  switch (err.response.status) {
    case 404: // Does not exist
      await opts.onError?.({
        type: 'flow_not_found',
        flowType: opts.flowType,
      })
      opts.onRestartFlow()
      return true
    case 410: // Expired
      // Re-initialize the flow
      await opts.onError?.({
        type: 'flow_not_found',
        flowType: opts.flowType,
      })
      opts.onRestartFlow()
      return true
    case 400:
      await opts.onValidationError((await err.response.json()) as unknown as T)
      return true
    case 403: // This typically happens with CSRF violations.
      await opts.onError?.({
        type: 'csrf_error',
        flowType: opts.flowType,
        body: body as GenericError,
      })
      opts.onRestartFlow()
      return true
    case 422: {
      throw new ResponseError(
        err.response,
        'The API returned an error code indicating a required redirect, but the SDK is outdated and does not know how to handle the action. Received response: ' +
          (await err.response.json()),
      )
    }
  }

  return false
}

const isFetchError = (err: unknown): err is FetchError => {
  return err instanceof FetchError
}

async function logResponseError(response: Response, printBody: boolean, wrap?: unknown[]) {
  console.error('Unable to decode API response', {
    response: {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: printBody ? await response.clone().text() : undefined,
    },
    errors: wrap,
  })
}
