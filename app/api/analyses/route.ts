/**
 * GET /api/analyses — List all analyses for the authenticated user.
 *
 * Fetches analyses and their parent documents separately, then
 * combines them into the shape the dashboard expects.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServerClient();

    // Fetch all analyses for this user
    const { data: analyses, error } = await supabase
      .from("analyses")
      .select("id, document_id, risk_score, risk_level, total_findings, critical_count, high_count, medium_count, low_count, false_positives_removed, analyzed_at")
      .eq("user_id", session.user.id)
      .order("analyzed_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 });
    }

    if (!analyses || analyses.length === 0) {
      return NextResponse.json({ analyses: [] });
    }

    // Fetch all related documents in one query
    const documentIds = [...new Set(analyses.map((a) => a.document_id))];
    const { data: documents } = await supabase
      .from("documents")
      .select("id, file_name, detected_type")
      .in("id", documentIds);

    // Create a lookup map for documents
    const docMap = new Map(
      (documents ?? []).map((d) => [d.id, d])
    );

    // Map to the shape the dashboard expects
    const mapped = analyses.map((a) => {
      const doc = docMap.get(a.document_id);
      return {
        id: a.id,
        document_name: doc?.file_name ?? "Untitled",
        document_type: doc?.detected_type ?? null,
        overall_risk_score: a.risk_score,
        risk_level: a.risk_level,
        summary_stats: {
          total_findings: a.total_findings,
          critical_count: a.critical_count,
          high_count: a.high_count,
          medium_count: a.medium_count,
          low_count: a.low_count,
          false_positives_removed: a.false_positives_removed,
        },
        created_at: a.analyzed_at,
      };
    });

    return NextResponse.json({ analyses: mapped });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
