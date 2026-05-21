/**
 * NextAuth.js type augmentations.
 *
 * Extends the default Session and JWT types to include the user's ID,
 * which we attach in the auth.ts callbacks. This ensures TypeScript
 * knows about session.user.id throughout the codebase.
 */

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
