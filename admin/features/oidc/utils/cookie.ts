import { NextRequest, NextResponse } from "next/server";
import type { OidcSession } from "../types";
import { SESSION_COOKIE_NAME, STATE_COOKIE_NAME } from "../types";

const isProduction = process.env.NODE_ENV === "production";

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
}

const defaultOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

/**
 * Sets session cookie in response
 */
export function setSessionCookie(
  response: NextResponse,
  session: OidcSession,
  maxAge?: number,
): void {
  const sessionMaxAge = maxAge ?? (session.expiresAt
    ? Math.max(0, session.expiresAt - Math.floor(Date.now() / 1000))
    : 30 * 24 * 60 * 60); // 30 days

  response.cookies.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    ...defaultOptions,
    maxAge: sessionMaxAge,
  });
}

/**
 * Clears session cookie from response
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE_NAME);
}

/**
 * Sets state cookie for OIDC flow
 */
export function setStateCookie(
  response: NextResponse,
  state: string,
  maxAge = 60 * 10, // 10 minutes
): void {
  response.cookies.set(STATE_COOKIE_NAME, state, {
    ...defaultOptions,
    maxAge,
  });
}

/**
 * Clears state cookie from response
 */
export function clearStateCookie(response: NextResponse): void {
  response.cookies.delete(STATE_COOKIE_NAME);
}

/**
 * Gets session from request
 */
export function getSessionFromRequest(req: NextRequest): OidcSession | null {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  
  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie) as OidcSession;
  } catch {
    return null;
  }
}

/**
 * Gets state from request
 */
export function getStateFromRequest(req: NextRequest): string | null {
  return req.cookies.get(STATE_COOKIE_NAME)?.value ?? null;
}

/**
 * Checks if session exists and is valid
 */
export function hasValidSession(req: NextRequest): boolean {
  const session = getSessionFromRequest(req);
  if (!session) return false;
  
  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  return session.expiresAt > now;
}

/**
 * Checks if token needs refresh (expires in less than 5 minutes)
 */
export function needsRefresh(req: NextRequest, thresholdSeconds = 300): boolean {
  const session = getSessionFromRequest(req);
  if (!session) return false;
  
  const now = Math.floor(Date.now() / 1000);
  return session.expiresAt - now < thresholdSeconds;
}