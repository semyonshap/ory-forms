import {
  OnRedirectHandler,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client-fetch"
import { SubmitHandler, UseFormReturn } from "react-hook-form"

import {
  onSubmitLogin,
  onSubmitRecovery,
  onSubmitRegistration,
  onSubmitVerification,
} from "../services"
import { useFlowStoreShallow } from "../context"
import { FormValues, OryFlowContainer, OryFlowType } from "../types"
import {
  computeDefaultValues,
  removeEmptyStrings,
  isUiNodeGroupEnum,
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

  const handleSuccess = (flow: OryFlowContainer) => {
    dispatchFormState({ type: "form_submit_end" })
    setFlowContainer(flow)
    const newValues = computeDefaultValues(flow.flow)
    methods.reset(newValues, {
      keepSubmitCount: true,
    })
  }

  const onRedirect: OnRedirectHandler = (url, _external) => {
    dispatchFormState({ type: "page_redirect" })
    window.location.assign(url)
  }

  const onSubmit: SubmitHandler<FormValues> = async (
    initialData: Record<string, unknown>,
  ) => {
    console.log("data:", initialData)

    dispatchFormState({ type: "form_submit_start" })
    try {
      const data = removeEmptyStrings(initialData)
      switch (flowType) {
        case OryFlowType.Login: {
          const submitData: UpdateLoginFlowBody = {
            ...(data as unknown as UpdateLoginFlowBody),
          }
          await onSubmitLogin(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
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
            setFlowContainer: handleSuccess,
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
            setFlowContainer: handleSuccess,
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
            setFlowContainer: handleSuccess,
            body: submitData,
          })
          break
        }
      }
      if ("password" in data) {
        methods.setValue("password", "")
      }
      if ("code" in data) {
        methods.setValue("code", "")
      }
      if ("totp_code" in data) {
        methods.setValue("totp_code", "")
      }

      if (
        typeof data.method === "string" &&
        isUiNodeGroupEnum(data.method) &&
        data.method === "code"
      ) {
        dispatchFormState({
          type: "action_select_method",
          method: data.method,
        })
      }
    } catch (error) {
      dispatchFormState({ type: "form_submit_end" })
      throw error
    }
  }

  return onSubmit
}
