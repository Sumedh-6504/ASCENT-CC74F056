/**
 * Supabase — Server Client
 *
 * Used in API routes and server components for authenticated writes.
 * This client uses the SERVICE_ROLE key which BYPASSES Row Level Security,
 * so all access control must be enforced in application code (via NextAuth session).
 *
 * ⚠️  Never import this file in client components ("use client").
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Creates a new server-side Supabase client per request.
 * Uses the service role key — bypasses RLS for admin-level writes.
 */
export function createServerClient() {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
