import { create } from "zustand"
import { FlowType, UiNodeGroupEnum } from "@ory/client-fetch"
import type {
  LoginFlow,
  RegistrationFlow,
  RecoveryFlow,
  VerificationFlow,
  SettingsFlow,
} from "@ory/client-fetch"

export type LoginFlowContainer = {
  flowType: FlowType.Login
  flow: LoginFlow
}

export type RegistrationFlowContainer = {
  flowType: FlowType.Registration
  flow: RegistrationFlow
}

export type RecoveryFlowContainer = {
  flowType: FlowType.Recovery
  flow: RecoveryFlow
}

export type VerificationFlowContainer = {
  flowType: FlowType.Verification
  flow: VerificationFlow
}

export type SettingsFlowContainer = {
  flowType: FlowType.Settings
  flow: SettingsFlow
}

type OryFlowContainer =
  | LoginFlowContainer
  | RegistrationFlowContainer
  | RecoveryFlowContainer
  | VerificationFlowContainer
  | SettingsFlowContainer

type FlowStep =
  | { current: "select_method" }
  | { current: "provide_identifier" }
  | { current: "method_active"; method: UiNodeGroupEnum }
  | { current: "success_screen" }
  | { current: "settings" }

export interface OryState {
  flow: OryFlowContainer | null
  step: FlowStep
  isSubmitting: boolean
  isReady: boolean
}

export interface OryActions {
  setFlow: (flow: OryFlowContainer | null) => void
  setStep: (step: FlowStep) => void
  setSubmitting: (value: boolean) => void
  setReady: (value: boolean) => void
  resetFlow: () => void
}

export type OryStore = OryState & OryActions

export const useOryStore = create<OryStore>((set) => ({
  flow: null,
  flowType: null,
  step: { current: "provide_identifier" },
  isSubmitting: false,
  isReady: true,

  setFlow: (flow) => set({ flow }),
  setStep: (step) => set({ step }),
  setSubmitting: (value) => set({ isSubmitting: value }),
  setReady: (value) => set({ isReady: value }),
  resetFlow: () =>
    set({
      flow: null,
      step: { current: "provide_identifier" },
      isSubmitting: false,
      isReady: true,
    }),
}))
