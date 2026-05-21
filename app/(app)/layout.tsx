/**
 * App Layout — Authenticated pages.
 *
 * Wraps all protected routes with:
 *   - NextAuth SessionProvider (for useSession() in client components)
 *   - Navbar with user avatar & navigation
 *   - Background gradient matching the LexGuard design system
 *
 * The session is fetched server-side via auth() and passed down
 * so child pages can access the user without an extra network call.
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Defensive redirect — middleware should catch this first,
  // but this is a safety net for edge cases.
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <SessionProvider session={session}>
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(160deg, #02091a 0%, #040e22 55%, #020c1e 100%)",
        }}
      >
        <Navbar
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }}
        />
        <main className="flex-1">{children}</main>
      </div>
    </SessionProvider>
  );
}
