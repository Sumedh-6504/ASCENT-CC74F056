import json
import os
import re
from typing import Any
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

SYSTEM_INSTRUCTION = """You are the LexGuard Judge Agent. You receive the Detective's findings and the full contract text.

Verify each finding, upgrade or downgrade severity as needed, and enrich each with a verdict, plain-English impact, recommendation, and negotiation tip.

Return ONLY this exact JSON object — no prose, no markdown outside the JSON:

{
  "document_type": "<CONTRACT | OFFER_LETTER | QUOTATION | TICKET_TERMS | PRIVACY_POLICY | TERMS_OF_SERVICE | OTHER>",
  "contract_summary": "<2-3 sentence plain English summary of what this document is and how dangerous it is>",
  "overall_risk_score": <integer 0-100>,
  "risk_level": "<SAFE | LOW | MEDIUM | HIGH | CRITICAL>",
  "summary_stats": {
    "total_findings": <number>,
    "critical_count": <number>,
    "high_count": <number>,
    "medium_count": <number>,
    "low_count": <number>,
    "false_positives_removed": <number>
  },
  "analysis_metadata": {
    "judge_confidence": <float 0.0-1.0>,
    "analysis_timestamp": "<ISO 8601 timestamp>"
  },
  "findings": [
    {
      "id": "<same id as detective>",
      "clause_text": "<same verbatim quote>",
      "clause_location": "<same location>",
      "category": "<same category>",
      "severity": "<CRITICAL | HIGH | MEDIUM | LOW>",
      "title": "<same or refined title>",
      "detective_finding": "<detective's original explanation>",
      "judge_verdict": "<2-3 sentence ruling in plain English — confirm, modify, or dismiss>",
      "plain_english_impact": "<1 sentence: exactly what could happen to the user if they sign>",
      "recommendation": "<ACCEPT | NEGOTIATE | REJECT>",
      "negotiation_tip": "<1-2 sentences: the exact counter-clause or ask to propose>",
      "verified": true,
      "false_positive": false
    }
  ]
}

Scoring rules:
- overall_risk_score = (CRITICAL×25 + HIGH×10 + MEDIUM×5 + LOW×1), capped at 100
- risk_level: SAFE=0-19, LOW=20-39, MEDIUM=40-59, HIGH=60-79, CRITICAL=80-100
- Exclude false positives from all summary_stats counts
- Set false_positive: true if the Detective flagged a standard, non-harmful clause
"""


def run_judge(contract_text: str, detective_findings: list[dict[str, Any]]) -> dict[str, Any]:
    if os.environ.get("USE_VERTEX_AI") == "true":
        client = genai.Client(
            vertexai=True,
            project=os.environ.get("GOOGLE_CLOUD_PROJECT", "ASCENT-CC74F056"),
            location=os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1"),
        )
    else:
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    truncated = contract_text[:20000]
    prompt = f"""DETECTIVE FINDINGS:
---
{json.dumps(detective_findings, indent=2)}
---

CONTRACT TEXT:
---
{truncated}
---

Return ONLY the JSON object."""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            temperature=0.1,
            max_output_tokens=8192,
        ),
    )

    raw = response.text or "{}"
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        cleaned = re.sub(r"```(?:json)?|```", "", raw).strip()
        return json.loads(cleaned)
