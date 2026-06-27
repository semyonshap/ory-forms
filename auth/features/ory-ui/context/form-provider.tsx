import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  UiNode,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
  VerificationFlow,
  isUiNodeInputAttributes,
} from "@ory/client-fetch"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { FormProvider, useForm, UseFormReturn } from "react-hook-form"
import { useFormSubmit } from "../hooks/useFormSubmit"

export type FlowType =
  | LoginFlow
  | RegistrationFlow
  | SettingsFlow
  | VerificationFlow
  | RecoveryFlow

export type FlowValues = Partial<
  | UpdateLoginFlowBody
  | UpdateRegistrationFlowBody
  | UpdateRecoveryFlowBody
  | UpdateSettingsFlowBody
  | UpdateVerificationFlowBody
>

export type FlowMethod =
  | "oidc"
  | "password"
  | "profile"
  | "totp"
  | "webauthn"
  | "passkey"
  | "link"
  | "lookup_secret"

interface FlowFormContextValue<T extends FlowValues = FlowValues> {
  flow: FlowType | undefined
  nodes: UiNode[]
  isLoading: boolean
  dispatchSubmit: (submitter?: { name: string; value: string }) => void
  form: UseFormReturn<Record<string, unknown>>
  onFormSubmit: (
    data: Record<string, unknown>,
    event?: React.BaseSyntheticEvent,
  ) => Promise<void>
}

const FlowFormContext = createContext<FlowFormContextValue | null>(null)

export function useFlowForm<T extends FlowValues = FlowValues>() {
  const ctx = useContext(FlowFormContext)
  if (!ctx) {
    throw new Error("useFlowForm must be used inside <FlowFormProvider>")
  }
  return ctx as FlowFormContextValue<T>
}

interface FlowFormProviderProps<T extends FlowValues> {
  flow?: FlowType
  only?: FlowMethod
  children: React.ReactNode
}

export function FlowFormProvider<T extends FlowValues>({
  flow,
  only,
  children,
}: FlowFormProviderProps<T>) {
  const [isLoading, setIsLoading] = useState(false)
  const submitterRef = useRef<{ name: string; value: string } | null>(null)
  const onSubmit = useFormSubmit()

  const nodes = useMemo<UiNode[]>(() => {
    if (!flow) return []
    return flow.ui.nodes.filter(
      ({ group }) => !only || group === "default" || group === only,
    )
  }, [flow, only])

  const defaultValues = useMemo(() => {
    const values: Record<string, unknown> = {}
    nodes.forEach((node) => {
      if (isUiNodeInputAttributes(node.attributes)) {
        const { type, name, value } = node.attributes
        if (type !== "button" && type !== "submit") {
          values[name] = value ?? ""
        }
      }
    })
    return values
  }, [nodes])

  const form = useForm<Record<string, unknown>>({ defaultValues })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues])

  const onFormSubmit = useCallback(
    async (data: Record<string, unknown>, event?: React.BaseSyntheticEvent) => {
      if (isLoading) return

      const submitter = (event?.nativeEvent as SubmitEvent)
        ?.submitter as HTMLButtonElement | null
      if (submitter?.name) data[submitter.name] = submitter.value

      if (submitterRef.current) {
        data[submitterRef.current.name] = submitterRef.current.value
        submitterRef.current = null
      }

      setIsLoading(true)
      try {
        await onSubmit(data as T)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, onSubmit],
  )

  const dispatchSubmit = useCallback(
    (submitter?: { name: string; value: string }) => {
      if (submitter) submitterRef.current = submitter
      form.handleSubmit(onFormSubmit)()
    },
    [form, onFormSubmit],
  )

  return (
    <FlowFormContext.Provider
      value={{ flow, nodes, isLoading, dispatchSubmit, form, onFormSubmit }}
    >
      <FormProvider {...form}>{children}</FormProvider>
    </FlowFormContext.Provider>
  )
}
