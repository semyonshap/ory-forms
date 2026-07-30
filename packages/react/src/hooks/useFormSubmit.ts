import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import {
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from '@ory/client-fetch'

import { isProduction } from '../utils/sdk'
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
    flowContainer,
    config,
    setFlowContainer,
    onSuccess,
    onValidationError,
    onError,
    onRedirect,
  } = useFlowStoreShallow((state) => ({
    config: state.config,
    flowContainer: state.flowContainer,
    setFlowContainer: state.setFlowContainer,
    onSuccess: state.onSuccess,
    onValidationError: state.onValidationError,
    onError: state.onError,
    onRedirect: state.onRedirect,
  }))

  const { flowType } = flowContainer

  const onSubmit: SubmitHandler<FormValues> = async (
    initialData: FormValues,
  ) => {
    const handleFlowUpdate = (container: OryFlowContainer) => {
      setFlowContainer(container)
      const newValues = computeDefaultValues(container.flow)
      methods.reset(newValues, {
        keepSubmitCount: true,
      })
    }

    const clearSensitiveData = (data: FormValues) => {
      if ('code' in data) methods.setValue('code', '')
      if ('password' in data) methods.setValue('password', '')
      if ('totp_code' in data) methods.setValue('totp_code', '')
    }

    const filtered = filterData(initialData, flowContainer)
    if (!isProduction()) console.log('Filtered:', filtered)

    switch (flowType) {
      case OryFlowType.Login: {
        const submitData: UpdateLoginFlowBody = {
          ...(filtered as unknown as UpdateLoginFlowBody),
        }
        await onSubmitLogin(flowContainer, config, {
          onRedirect,
          setFlowContainer: handleFlowUpdate,
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
          setFlowContainer: handleFlowUpdate,
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
          setFlowContainer: handleFlowUpdate,
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
          setFlowContainer: handleFlowUpdate,
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
          setFlowContainer: handleFlowUpdate,
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
