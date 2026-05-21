/**
 * NextAuth.js catch-all API route.
 * Handles GET (OAuth callbacks, CSRF) and POST (sign-in, sign-out).
 *
 * NextAuth v5 handlers are exported directly to ensure all CSRF,
 * cookie, and request-context bindings are perfectly handled by the engine.
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
