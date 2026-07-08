import {
  OnRedirectHandler,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client-fetch"
import { SubmitHandler, UseFormReturn } from "react-hook-form"

import {
  onSubmitLogin,
  onSubmitRecovery,
  onSubmitRegistration,
  onSubmitSettings,
  onSubmitVerification,
} from "../services"
import { FormValues, OryFlowContainer, OryFlowType } from "../types"
import { useFlowStoreShallow } from "../context"
import {
  applySelectAccountPrompt,
  filterSettingsFields,
  removeEmptyStrings,
} from "../lib"

export function useFormSubmit(methods: UseFormReturn<FormValues>) {
  const { flowContainer, config, dispatchFormState, setFlowContainer } =
    useFlowStoreShallow((state) => ({
      config: state.config,
      flowContainer: state.flowContainer,
      dispatchFormState: state.dispatchFormState,
      setFlowContainer: state.setFlowContainer,
    }))

  const { flowType } = flowContainer

  const onRedirect: OnRedirectHandler = (url, _external) => {
    dispatchFormState({ type: "page_redirect" })
    window.location.assign(url)
  }

  const onSubmit: SubmitHandler<FormValues> = async (
    initialData: FormValues,
  ) => {
    const isResend = initialData.method === "code"

    const startSubmit = () => {
      if (!isResend) dispatchFormState({ type: "form_submit_start" })
    }

    const endSubmit = () => {
      if (!isResend) dispatchFormState({ type: "form_submit_end" })
    }

    const handleFlowUpdate = (container: OryFlowContainer) => {
      endSubmit()
      setFlowContainer(container)
    }

    const clearSensitiveData = (data: FormValues) => {
      if ("password" in data) {
        methods.setValue("password", "")
      }
      if ("code" in data) {
        methods.setValue("code", "")
      }
      if ("totp_code" in data) {
        methods.setValue("totp_code", "")
      }
    }

    startSubmit()

    try {
      const data = removeEmptyStrings<FormValues>(initialData)
      console.log("Submit", data)
      
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

          if (submitData.method === "code" && submitData.code) {
            submitData.resend = ""
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

          console.log("filtered:", filtered)

          applySelectAccountPrompt(submitData)

          await onSubmitSettings(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleFlowUpdate,
            body: submitData,
          })
          break
        }
      }

      clearSensitiveData(data)
    } catch (error) {
      endSubmit()
      throw error
    }
  }

  return onSubmit
}
