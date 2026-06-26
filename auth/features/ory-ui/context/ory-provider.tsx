"use client"

import { createContext, useContext, ReactNode } from "react"
import { OryClientConfiguration } from "../utils/oryConfiguration"

const OryConfigContext = createContext<OryClientConfiguration | null>(null)

interface OryConfigProviderProps {
  children: ReactNode
  config: OryClientConfiguration
}

export function OryConfigProvider({
  children,
  config,
}: OryConfigProviderProps) {
  return (
    <OryConfigContext.Provider value={config}>
      {children}
    </OryConfigContext.Provider>
  )
}

export function useOryConfig(): OryClientConfiguration {
  const config = useContext(OryConfigContext)
  if (!config) {
    throw new Error(
      "useOryConfig must be used within a OryConfigProvider with a config",
    )
  }
  return config
}
