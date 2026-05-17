import { NextResponse } from "next/server";
import { detective } from "../../../lib/agents/detective";
import { judge } from "../../../lib/agents/judge";

export async function POST(request: Request) {
  try {
    const { contractText } = await request.json();

    if (!contractText || typeof contractText !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing contractText" },
        { status: 400 }
      );
    }

    // Agent 1: Detective
    const detectiveFindings = await detective(contractText);

    // Agent 2: Judge
    const analysis = await judge(contractText, detectiveFindings);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Analysis pipeline error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze contract" },
      { status: 500 }
    );
  }
}
