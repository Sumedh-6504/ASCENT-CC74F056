/**
 * POST /api/analyze — Run contract analysis and persist results.
 *
 * Normalised write flow:
 *   1. Authenticate the user via NextAuth session
 *   2. Upsert user into the `users` table (sync from NextAuth)
 *   3. Forward the contract text to the FastAPI backend
 *   4. Insert into `documents` → `analyses` → `findings` (3 tables)
 *   5. Return the analysis ID for client-side redirect
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

// Increase timeout for long Gemini calls (two-agent pipeline)
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const contractText = body.contractText ?? body.contract_text ?? "";
    const documentName = body.documentName ?? "Untitled Contract";

    // Forward to FastAPI backend
    const res = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contract_text: contractText }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // If user is authenticated, persist across normalised tables
    if (session?.user?.id) {
      try {
        const supabase = createServerClient();

        // ── Step 1: Upsert user (sync from NextAuth on every analysis) ──
        await supabase
          .from("users")
          .upsert(
            {
              id: session.user.id,
              email: session.user.email ?? "unknown",
              name: session.user.name ?? null,
              avatar_url: session.user.image ?? null,
            },
            { onConflict: "id" }
          );

        // ── Step 2: Insert document ─────────────────────────────────────
        const { data: doc, error: docErr } = await supabase
          .from("documents")
          .insert({
            user_id: session.user.id,
            file_name: documentName,
            detected_type: data.document_type ?? null,
            contract_text: contractText,
            char_count: contractText.length,
          })
          .select("id")
          .single();

        if (docErr || !doc) {
          console.error("Document insert error:", docErr);
          return NextResponse.json({ ...data, id: null });
        }

        // ── Step 3: Insert analysis ─────────────────────────────────────
        const stats = data.summary_stats ?? {};
        const meta = data.analysis_metadata ?? {};

        const { data: analysis, error: analysisErr } = await supabase
          .from("analyses")
          .insert({
            document_id: doc.id,
            user_id: session.user.id,
            risk_score: data.overall_risk_score ?? 0,
            risk_level: data.risk_level ?? "SAFE",
            judge_confidence: meta.judge_confidence ?? 0,
            contract_summary: data.contract_summary ?? null,
            total_findings: stats.total_findings ?? 0,
            critical_count: stats.critical_count ?? 0,
            high_count: stats.high_count ?? 0,
            medium_count: stats.medium_count ?? 0,
            low_count: stats.low_count ?? 0,
            false_positives_removed: stats.false_positives_removed ?? 0,
          })
          .select("id")
          .single();

        if (analysisErr || !analysis) {
          console.error("Analysis insert error:", analysisErr);
          return NextResponse.json({ ...data, id: null });
        }

        // ── Step 4: Insert findings (batch) ─────────────────────────────
        const rawFindings = data.findings ?? [];
        if (rawFindings.length > 0) {
          const findingRows = rawFindings.map(
            (f: Record<string, unknown>, i: number) => ({
              analysis_id: analysis.id,
              finding_ref: (f.id as string) ?? `finding-${i + 1}`,
              title: (f.title as string) ?? "Untitled",
              category: (f.category as string) ?? "OTHER_RISK",
              severity: (f.severity as string) ?? "LOW",
              clause_text: (f.clause_text as string) ?? null,
              clause_location: (f.clause_location as string) ?? null,
              detective_finding: (f.detective_finding as string) ?? null,
              judge_verdict: (f.judge_verdict as string) ?? null,
              plain_english_impact: (f.plain_english_impact as string) ?? null,
              recommendation: (f.recommendation as string) ?? "NEGOTIATE",
              negotiation_tip: (f.negotiation_tip as string) ?? null,
              verified: (f.verified as boolean) ?? false,
              false_positive: (f.false_positive as boolean) ?? false,
              sort_order: i,
            })
          );

          const { error: findingsErr } = await supabase
            .from("findings")
            .insert(findingRows);

          if (findingsErr) {
            console.error("Findings insert error:", findingsErr);
          }
        }

        // Return analysis data + the database ID for redirect
        return NextResponse.json({ ...data, id: analysis.id });
      } catch (dbErr) {
        console.error("Database error:", dbErr);
      }
    }

    // Guest user or DB save failed — return data without an ID
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to the analysis service. Is the backend running?" },
      { status: 503 }
    );
  }
}
