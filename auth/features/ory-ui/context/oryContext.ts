import { useContext } from "react"
import { useStore } from "zustand"
import { useShallow } from "zustand/shallow"

import { OryFormContext } from "./oryFormProvider"
import { FlowStoreContext, FlowStoreState } from "./oryStore"

export function useFlowStore<T>(selector: (state: FlowStoreState) => T): T {
  const store = useContext(FlowStoreContext)
  if (!store) {
    throw new Error("useFlowStore must be used within a FlowStoreProvider")
  }
  return useStore(store, selector)
}

export function useFlowStoreShallow<T>(
  selector: (state: FlowStoreState) => T,
): T {
  const store = useContext(FlowStoreContext)
  if (!store) throw new Error("...")
  return useStore(store, useShallow(selector))
}

export function useOryFormContext() {
  const ctx = useContext(OryFormContext)
  if (!ctx)
    throw new Error("useOryFormContext must be used within OryFormProvider")
  return ctx
}
