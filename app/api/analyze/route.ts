import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

// Increase timeout for long Gemini calls (two-agent pipeline)
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Accept both camelCase (frontend) and snake_case
        contract_text: body.contractText ?? body.contract_text ?? "",
      }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to the analysis service. Is the backend running?" },
      { status: 503 }
    );
  }
}
