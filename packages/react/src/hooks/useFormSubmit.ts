import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import {
  OnRedirectHandler,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from '@ory/client-fetch'

import { useFlowStoreShallow } from '../context'
import { FormValues, OryFlowContainer, OryFlowType, UpdateOAuth2ConsentFlowBody } from '../types'
import {
  applySelectAccountPrompt,
  computeDefaultValues,
  filterSettingsFields,
  removeEmptyStrings,
} from '../lib'
import {
  onSubmitLogin,
  onSubmitOAuth2Consent,
  onSubmitRecovery,
  onSubmitRegistration,
  onSubmitSettings,
  onSubmitVerification,
} from '../services'

export function useFormSubmit(methods: UseFormReturn<FormValues>) {
  const { flowContainer, config, setFlowContainer } = useFlowStoreShallow((state) => ({
    config: state.config,
    flowContainer: state.flowContainer,
    setFlowContainer: state.setFlowContainer,
  }))
  const { flowType } = flowContainer

  const onRedirect: OnRedirectHandler = (url) => {
    window.location.assign(url)
  }

  const onSubmit: SubmitHandler<FormValues> = async (initialData: FormValues) => {
    const handleFlowUpdate = (container: OryFlowContainer) => {
      setFlowContainer(container)
      const newValues = computeDefaultValues(container.flow)
      methods.reset(newValues, {
        keepSubmitCount: true,
      })
    }

    const clearSensitiveData = (data: FormValues) => {
      if ('password' in data) {
        methods.setValue('password', '')
      }
      if ('code' in data) {
        methods.setValue('code', '')
      }
      if ('totp_code' in data) {
        methods.setValue('totp_code', '')
      }
    }

    const data = removeEmptyStrings<FormValues>(initialData)

    switch (flowType) {
      case OryFlowType.Login: {
        const submitData: UpdateLoginFlowBody = {
          ...(data as unknown as UpdateLoginFlowBody),
        }
        await onSubmitLogin(flowContainer, config, {
          onRedirect,
          setFlowContainer: handleFlowUpdate,
          body: submitData,
        })
        break
      }
      case OryFlowType.Registration: {
        const submitData: UpdateRegistrationFlowBody = {
          ...(data as unknown as UpdateRegistrationFlowBody),
        }

        await onSubmitRegistration(flowContainer, config, {
          onRedirect,
          setFlowContainer: handleFlowUpdate,
          body: submitData,
        })
        break
      }
      case OryFlowType.Verification: {
        const submitData = {
          ...(data as unknown as UpdateVerificationFlowBody),
        }

        await onSubmitVerification(flowContainer, config, {
          onRedirect,
          setFlowContainer: handleFlowUpdate,
          body: submitData,
        })
        break
      }
      case OryFlowType.Recovery: {
        const submitData: UpdateRecoveryFlowBody = {
          ...(data as unknown as UpdateRecoveryFlowBody),
        }

        await onSubmitRecovery(flowContainer, config, {
          onRedirect,
          setFlowContainer: handleFlowUpdate,
          body: submitData,
        })
        break
      }
      case OryFlowType.Settings: {
        const filtered = filterSettingsFields(data, data.method as string)
        const submitData: UpdateSettingsFlowBody = {
          ...(filtered as unknown as UpdateSettingsFlowBody),
        }

        console.log('filtered', filtered)

        applySelectAccountPrompt(submitData)

        await onSubmitSettings(flowContainer, config, {
          onRedirect,
          setFlowContainer: handleFlowUpdate,
          body: submitData,
        })
        break
      }
      case OryFlowType.OAuth2Consent: {
        const submitData: UpdateOAuth2ConsentFlowBody = {
          ...(data as unknown as UpdateOAuth2ConsentFlowBody),
        }
        await onSubmitOAuth2Consent(flowContainer, {
          onRedirect,
          body: submitData,
        })
        break
      }
    }

    clearSensitiveData(data)
  }

  return onSubmit
}
