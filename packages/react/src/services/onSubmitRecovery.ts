import {
  ContinueWith,
  GenericError,
  handleContinueWith,
  instanceOfContinueWithRecoveryUi,
  OnRedirectHandler,
  RecoveryFlow,
  recoveryUrl,
  UpdateRecoveryFlowBody,
} from '@ory/client-fetch'
import {
  OryFlowType,
  OryConfiguration,
  OryFlowContainer,
  OnSubmitHandlerPropsWithFlow,
} from '../types'
import { handleFlowError, replaceWindowFlowId } from '../utils'
import { flowHasErrors } from '../lib'

export async function onSubmitRecovery(
  { flow }: OryFlowContainer,
  config: OryConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerPropsWithFlow<UpdateRecoveryFlowBody>,
) {
  const method = String(body.method)

  await config.sdk.frontend
    .updateRecoveryFlowRaw({
      flow: flow.id,
      updateRecoveryFlowBody: body,
    })
    .then(async (res) => {
      const flow = await res.value()

      await onSuccess?.({
        flowType: OryFlowType.Recovery,
        method,
        flow,
      })

      const didContinueWith = handleContinueWith(flow.continue_with, {
        onRedirect,
      })

      // eslint-disable-next-line promise/always-return
      if (didContinueWith) {
        return
      }

      setFlowContainer({
        flow,
        flowType: OryFlowType.Recovery,
      })
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(recoveryUrl(config), true)
          }
        },
        onValidationError: async (body: RecoveryFlow | { error: GenericError }) => {
          if ('error' in body) {
            handleContinueWithRecoveryUIError(body.error, config, onRedirect)
            return
          } else {
            if (flowHasErrors(body.ui)) {
              await onValidationError?.({
                flowType: OryFlowType.Recovery,
                flow: body,
              })
            }
            setFlowContainer({
              flow: body,
              flowType: OryFlowType.Recovery,
            })
          }
        },
        onRedirect,
        config,
        flowType: OryFlowType.Recovery,
        onError,
      }),
    )
}

function handleContinueWithRecoveryUIError(
  error: GenericError,
  config: OryConfiguration,
  onRedirect: OnRedirectHandler,
) {
  if ('continue_with' in error.details && Array.isArray(error.details.continue_with)) {
    const continueWithRecovery = (error.details.continue_with as ContinueWith[]).find(
      instanceOfContinueWithRecoveryUi,
    )
    if (continueWithRecovery?.action === 'show_recovery_ui') {
      onRedirect(config.project.recovery_ui_url + '?flow=' + continueWithRecovery?.flow.id, false)
      return
    }
  }
  onRedirect(recoveryUrl(config), true)
}
