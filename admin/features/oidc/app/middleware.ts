import { NextRequest, NextResponse } from "next/server";
import type { OidcSession } from "../types";
import { SESSION_COOKIE_NAME } from "../types";

export interface OidcMiddlewareOptions {
  /** Paths that require authentication. Supports exact strings and regex patterns. */
  protectedPaths?: Array<string | RegExp>;
  /** Paths that are always public (e.g. login, callback). */
  publicPaths?: Array<string | RegExp>;
  /** Where to redirect unauthenticated users. Defaults to "/api/auth/login". */
  loginPath?: string;
}

function matchesPath(
  pathname: string,
  patterns: Array<string | RegExp>
): boolean {
  return patterns.some((pattern) =>
    typeof pattern === "string"
      ? pathname === pattern || pathname.startsWith(pattern)
      : pattern.test(pathname)
  );
}

function isSessionValid(session: OidcSession): boolean {
  return session.expiresAt > Math.floor(Date.now() / 1000);
}

/**
 * Next.js middleware that enforces authentication on protected paths.
 *
 * Usage in middleware.ts:
 * ```ts
 * import { createOidcMiddleware } from "@/features/oidc";
 * export const middleware = createOidcMiddleware({ protectedPaths: ["/dashboard"] });
 * export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
 * ```
 */
export function createOidcMiddleware(options: OidcMiddlewareOptions = {}) {
  const {
    protectedPaths = ["/"],
    publicPaths = [
      "/api/auth/login",
      "/api/auth/callback",
      "/api/auth/logout",
      "/api/auth/revoke",
      "/login",
    ],
    loginPath = "/api/auth/login",
  } = options;

  return function oidcMiddleware(req: NextRequest): NextResponse {
    const { pathname } = req.nextUrl;

    // Always allow public paths
    if (matchesPath(pathname, publicPaths)) {
      return NextResponse.next();
    }

    // Only guard explicitly protected paths
    if (!matchesPath(pathname, protectedPaths)) {
      return NextResponse.next();
    }

    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return redirectToLogin(req, loginPath);
    }

    let session: OidcSession;
    try {
      session = JSON.parse(sessionCookie) as OidcSession;
    } catch {
      return redirectToLogin(req, loginPath);
    }

    if (!isSessionValid(session)) {
      // Session expired — redirect to login
      const response = redirectToLogin(req, loginPath);
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    // Attach user info as request headers for downstream use
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-oidc-sub", session.user.sub);
    requestHeaders.set("x-oidc-user", JSON.stringify(session.user));

    return NextResponse.next({ request: { headers: requestHeaders } });
  };
}

function redirectToLogin(req: NextRequest, loginPath: string): NextResponse {
  const loginUrl = new URL(loginPath, req.url);
  loginUrl.searchParams.set("returnTo", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}