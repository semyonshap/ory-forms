"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { OidcUser } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionData {
  user: OidcUser;
  expiresAt: number;
}

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

interface SessionContextValue {
  /** Current authenticated user, or null */
  user: OidcUser | null;
  /** Lifecycle status of the session */
  status: SessionStatus;
  /** True while the initial session fetch is in progress */
  isLoading: boolean;
  /** True when a valid session exists */
  isAuthenticated: boolean;
  /** Manually re-fetch the session (e.g. after a token refresh) */
  refresh: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SessionContext = createContext<SessionContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface SessionProviderProps {
  children: ReactNode;
  /**
   * Pass a pre-resolved session from a Server Component to avoid
   * an extra client-side fetch on first render.
   */
  initialSession?: SessionData | null;
  /** URL of the session endpoint. Defaults to "/api/auth/session". */
  sessionUrl?: string;
  /**
   * How often (in ms) to re-check session validity in the background.
   * Set to 0 to disable. Defaults to 5 minutes.
   */
  refetchInterval?: number;
}

export function SessionProvider({
  children,
  initialSession = null,
  sessionUrl = "/api/auth/session",
  refetchInterval = 5 * 60 * 1000,
}: SessionProviderProps) {
  const [session, setSession] = useState<SessionData | null>(initialSession);
  const [status, setStatus] = useState<SessionStatus>(
    initialSession ? "authenticated" : "loading"
  );

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(sessionUrl, { credentials: "same-origin" });

      if (res.ok) {
        const data: SessionData = await res.json();
        setSession(data);
        setStatus("authenticated");
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
    } catch {
      setSession(null);
      setStatus("unauthenticated");
    }
  }, [sessionUrl]);

  // Initial fetch only when no initialSession was provided
  useEffect(() => {
    if (!initialSession) {
      fetchSession();
    }
  }, [fetchSession, initialSession]);

  // Background polling
  useEffect(() => {
    if (refetchInterval <= 0) return;

    const id = setInterval(fetchSession, refetchInterval);
    return () => clearInterval(id);
  }, [fetchSession, refetchInterval]);

  // Re-fetch when the tab becomes visible again
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchSession();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [fetchSession]);

  const value: SessionContextValue = {
    user: session?.user ?? null,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    refresh: fetchSession,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the current session context.
 *
 * @example
 * const { user, isAuthenticated, isLoading } = useSession();
 */
export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used inside <SessionProvider>");
  }
  return ctx;
}

/**
 * Returns only the authenticated user.
 * Returns null when unauthenticated or loading.
 *
 * @example
 * const user = useCurrentUser();
 */
export function useCurrentUser(): OidcUser | null {
  return useSession().user;
}