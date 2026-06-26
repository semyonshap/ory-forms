import { create } from "zustand"
import { FlowType, LoginFlow } from "@ory/client-fetch"

type AnyFlowType =
  | FlowType.Login
  | FlowType.Recovery
  | FlowType.Registration
  | FlowType.Verification

export interface OryState {
  flow: LoginFlow | null
  flowType: AnyFlowType | null
  isLoading: boolean
  error: Error | null
  setFlow: (flow: LoginFlow | null, flowType: AnyFlowType | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
  resetFlow: () => void
}

export const useOryStore = create<OryState>((set) => ({
  flow: null,
  flowType: null,
  isLoading: false,
  error: null,
  setFlow: (flow, flowType) => set({ flow, flowType }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  resetFlow: () => set({ flow: null, isLoading: false, error: null }),
}))
