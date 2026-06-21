import { cookies } from "next/headers";
import type { OidcSession, OidcUser } from "../types";
import { SESSION_COOKIE_NAME } from "../types";
import type { SessionData } from "./sessionProvider";

/**
 * Reads and validates the session cookie in Server Components / Route Handlers.
 * Returns null if the session is missing or expired.
 */
export async function getServerSession(): Promise<OidcSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!raw) return null;

  let session: OidcSession;
  try {
    session = JSON.parse(raw) as OidcSession;
  } catch {
    return null;
  }

  const isExpired = session.expiresAt <= Math.floor(Date.now() / 1000);
  if (isExpired) return null;

  return session;
}

/**
 * Returns only the user from the current server-side session.
 * Convenience wrapper around getServerSession().
 */
export async function getServerUser(): Promise<OidcUser | null> {
  const session = await getServerSession();
  return session?.user ?? null;
}

/**
 * Serialises the server session into the shape expected by SessionProvider's
 * `initialSession` prop, so the client avoids a redundant fetch on hydration.
 */
export async function getInitialSession(): Promise<SessionData | null> {
  const session = await getServerSession();
  if (!session) return null;

  return {
    user: session.user,
    expiresAt: session.expiresAt,
  };
}