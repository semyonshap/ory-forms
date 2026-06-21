import { useContext } from "react"
import { SessionContext } from "./sessionProvider"

/**
 * A hook to get the current session from the Ory Network.
 *
 * ```ts
 * const { session, isLoading, error } = useSession()
 *
 * if (isLoading) return <div>Loading...</div>
 * if (session) return <div>Session: {session.id}</div>
 * ```
 *
 * :::note
 * This is a client-side hook and must be used within a React component.
 * On the server, use `getServerSession` from `@ory/nextjs`
 * and hydrate `SessionProvider` with the session.
 * :::
 */
export function useSession() {
  return useContext(SessionContext)
}