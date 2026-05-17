import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let text = "";

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const data = await pdfParse(buffer);
      text = data.text;
    } else {
      // Fallback for TXT, MD, CSV, or unknown formats
      text = buffer.toString("utf-8");
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse file: " + error.message },
      { status: 500 }
    );
  }
}
