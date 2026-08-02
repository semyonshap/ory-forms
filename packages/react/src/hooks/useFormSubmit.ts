import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import {
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from '@ory/client-fetch'

import { useFlowStoreShallow } from '../context'
import {
  applySelectAccountPrompt,
  computeDefaultValues,
  filterData,
} from '../lib'
import {
  FormValues,
  OryFlowContainer,
  OryFlowType,
  UpdateOAuth2ConsentFlowBody,
} from '../types'
import {
  onSubmitLogin,
  onSubmitOAuth2Consent,
  onSubmitRecovery,
  onSubmitRegistration,
  onSubmitSettings,
  onSubmitVerification,
} from '../services'

export function useFormSubmit(methods: UseFormReturn<FormValues>) {
  const {
    flowNodes,
    config,
    flowContainer,
    transientPayload,
    setFlowContainer,
    onSuccess,
    onValidationError,
    onError,
    onRedirect,
  } = useFlowStoreShallow((s) => ({
    flowNodes: s.flowNodes,
    config: s.config,
    flowContainer: s.flowContainer,
    transientPayload: s.transientPayload,
    setFlowContainer: s.setFlowContainer,
    onSuccess: s.onSuccess,
    onValidationError: s.onValidationError,
    onError: s.onError,
    onRedirect: s.onRedirect,
  }))

  const { flowType } = flowContainer

  const onSubmit: SubmitHandler<FormValues> = async (
    initialData: FormValues,
  ) => {
    const handleSuccess = (container: OryFlowContainer) => {
      setFlowContainer(container)
      const newValues = computeDefaultValues(
        container.flow,
        transientPayload,
      )
      methods.reset(newValues, {
        keepSubmitCount: true,
      })
    }

    const clearSensitiveData = (data: FormValues) => {
      if ('code' in data) methods.setValue('code', '')
      if ('password' in data) methods.setValue('password', '')
      if ('totp_code' in data) methods.setValue('totp_code', '')
    }

    const filtered = filterData({
      data: initialData,
      nodes: flowNodes,
      transientPayload,
    })

    switch (flowType) {
      case OryFlowType.Login: {
        const submitData: UpdateLoginFlowBody = {
          ...(filtered as unknown as UpdateLoginFlowBody),
        }
        await onSubmitLogin(flowContainer, config, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: submitData,
          onSuccess,
          onValidationError,
          onError,
        })
        break
      }
      case OryFlowType.Registration: {
        const submitData: UpdateRegistrationFlowBody = {
          ...(filtered as unknown as UpdateRegistrationFlowBody),
        }

        await onSubmitRegistration(flowContainer, config, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: submitData,
          onSuccess,
          onValidationError,
          onError,
        })
        break
      }
      case OryFlowType.Verification: {
        const submitData = {
          ...(filtered as unknown as UpdateVerificationFlowBody),
        }

        await onSubmitVerification(flowContainer, config, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: submitData,
          onSuccess,
          onValidationError,
          onError,
        })
        break
      }
      case OryFlowType.Recovery: {
        const submitData: UpdateRecoveryFlowBody = {
          ...(filtered as unknown as UpdateRecoveryFlowBody),
        }

        await onSubmitRecovery(flowContainer, config, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: submitData,
          onSuccess,
          onValidationError,
          onError,
        })
        break
      }
      case OryFlowType.Settings: {
        const submitData: UpdateSettingsFlowBody = {
          ...(filtered as unknown as UpdateSettingsFlowBody),
        }

        applySelectAccountPrompt(submitData)

        await onSubmitSettings(flowContainer, config, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: submitData,
          onSuccess,
          onValidationError,
          onError,
        })
        break
      }
      case OryFlowType.OAuth2Consent: {
        const submitData: UpdateOAuth2ConsentFlowBody = {
          ...(filtered as unknown as UpdateOAuth2ConsentFlowBody),
        }
        await onSubmitOAuth2Consent(flowContainer, {
          onRedirect,
          body: submitData,
          onSuccess,
          onError,
        })
        break
      }
    }

    clearSensitiveData(filtered)
  }

  return onSubmit
}
