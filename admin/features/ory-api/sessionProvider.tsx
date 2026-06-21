import { Session } from "@ory/client-fetch"
import { createContext, useCallback, useEffect, useRef, useState } from "react"
import { frontendClient } from "./frontendClient"

type SessionState = {
  session: Session | null
  error?: Error
}

/**
 * Holds the session context data.
 * This context is used to provide the session data to the children of the provider.
 * It is used by the {@link useSession} hook to access the session data.
 */
export type SessionContextData = {
  /** Whether the session is currently being loaded */
  isLoading: boolean
  /** Whether the session has been loaded at least once */
  initialized: boolean
  /** The current session or null if unauthenticated or an error occurred */
  session: Session | null
  /** The error that occurred when fetching the session, if any */
  error: Error | undefined
  /** Refetches the session */
  refetch: () => Promise<void>
}

export const SessionContext = createContext<SessionContextData>({
  session: null,
  isLoading: false,
  initialized: false,
  error: undefined,
  refetch: async () => {},
})

export type SessionProviderProps = {
  session?: Session | null
  baseUrl?: string
} & React.PropsWithChildren

/**
 * A provider that fetches the session from the Ory Network and provides it to the children.
 *
 * ```tsx
 * <SessionProvider>
 *   <MyApp />
 * </SessionProvider>
 * ```
 *
 * If you have a session from the server, you can pass it to the provider:
 *
 * ```tsx
 * <SessionProvider session={serverSession}>
 * ```
 *
 * @see {@link useSession}
 */
export function SessionProvider({
  session: initialSession,
  children,
  baseUrl,
}: SessionProviderProps) {
  const initialized = useRef(!!initialSession)
  const [isLoading, setLoading] = useState(false)
  const [sessionState, setSessionState] = useState<SessionState>(() => ({
    session: initialSession?.active ? initialSession : null,
  }))

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true)
      const session = await frontendClient({ forceBaseUrl: baseUrl }).toSession()
      setSessionState({ session: session.active ? session : null })
    } catch (error) {
      setSessionState({ session: null, error: error as Error })
    } finally {
      setLoading(false)
    }
  }, [baseUrl])

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      void fetchSession()
    }
  }, [fetchSession])

  return (
    <SessionContext.Provider
      value={{
        session: sessionState.session,
        error: sessionState.error,
        isLoading,
        initialized: initialized.current,
        refetch: fetchSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}