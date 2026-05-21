/**
 * Supabase — Browser Client
 *
 * Used in client components ("use client") for read-only queries.
 * This client uses the ANON key which respects Row Level Security.
 *
 * For writes and authenticated operations, use the server client
 * in `lib/supabase/server.ts` which uses the SERVICE_ROLE key.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Singleton browser client — safe to import in any "use client" component.
 * Uses the anon key so all queries are subject to RLS policies.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
