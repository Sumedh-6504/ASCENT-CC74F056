import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const res = await fetch(`${BACKEND_URL}/parse`, {
      method: "POST",
      body: formData,
      // Do NOT set Content-Type — fetch sets it automatically with the correct boundary
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to the parsing service. Is the backend running?" },
      { status: 503 }
    );
  }
}
