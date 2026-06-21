// Client / configuration
export { getOidcClient } from "./app/client";

// Middleware
export { createOidcMiddleware } from "./app/middleware";
export type { OidcMiddlewareOptions } from "./app/middleware";

// Auth flows
export { handleLogin } from "./flow/login";
export { handleCallback } from "./flow/callback";
export { handleLogout } from "./flow/logout";
export { handleRefresh } from "./flow/refresh";

// Session — client (use in Client Components)
export {
  SessionProvider,
  useSession,
  useCurrentUser,
} from "./app/sessionProvider";
export type { SessionData } from "./app/sessionProvider";

// Session — server (use in Server Components & Route Handlers)
export {
  getServerSession,
  getServerUser,
  getInitialSession,
} from "./app/sessionServer";

// Types
export type { OidcConfig, OidcSession, OidcUser } from "./types";
export {
  SESSION_COOKIE_NAME,
  STATE_COOKIE_NAME,
  CODE_VERIFIER_COOKIE_NAME,
} from "./types";

export {
  setSessionCookie,
  clearSessionCookie,
  setStateCookie,
  getStateFromRequest,
  clearStateCookie,
  getSessionFromRequest,
  hasValidSession,
  needsRefresh,
} from "./utils/cookie";
