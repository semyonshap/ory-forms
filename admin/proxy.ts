/**
 * proxy.ts  (project root, next to app/)
 *
 * Protects all routes under /clients, /users, /metrics, and /relationships.
 * Lets auth routes and static assets pass through freely.
 */
import { createOidcMiddleware } from "@/features/oidc";

export const proxy = createOidcMiddleware({
  protectedPaths: ["/users", "/metrics", "/relationships"],
});

// Apply middleware to everything except Next.js internals & static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
