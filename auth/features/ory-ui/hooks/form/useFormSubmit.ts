import {
  OnRedirectHandler,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client-fetch"
import { SubmitHandler, useFormContext } from "react-hook-form"

import {
  onSubmitLogin,
  onSubmitRecovery,
  onSubmitRegistration,
  onSubmitVerification,
} from "../../services"
import { useFlowStoreShallow } from "../../context"
import { removeEmptyStrings, computeDefaultValues } from "../../utils"
import { FormValues, OryFlowContainer, OryFlowType } from "../../types"

export function useFormSubmit() {
  const { flowContainer, config, dispatchFormState, setFlowContainer } =
    useFlowStoreShallow((state) => ({
      flowContainer: state.flowContainer,
      config: state.config,
      dispatchFormState: state.dispatchFormState,
      setFlowContainer: state.setFlowContainer,
    }))

  const methods = useFormContext()

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
    } catch (error) {
      dispatchFormState({ type: "form_submit_end" })
      throw error
    }
  }

  return onSubmit
}
