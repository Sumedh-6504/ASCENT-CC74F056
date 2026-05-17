import json
import re
from datetime import datetime, timezone
from typing import Any

from gemini_client import call_gemini, get_client, types

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
      "judge_verdict": "<2-3 sentence ruling in plain English>",
      "plain_english_impact": "<1 sentence: exactly what could happen to the user if they sign>",
      "recommendation": "<ACCEPT | NEGOTIATE | REJECT>",
      "negotiation_tip": "<1-2 sentences: exact counter-clause to propose>",
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


def _fallback_report(detective_findings: list[dict[str, Any]]) -> dict[str, Any]:
    """Safe fallback when the Judge response can't be parsed."""
    return {
        "document_type": "CONTRACT",
        "contract_summary": "Analysis completed. Review individual findings below.",
        "overall_risk_score": 50,
        "risk_level": "MEDIUM",
        "summary_stats": {
            "total_findings": len(detective_findings),
            "critical_count": sum(1 for f in detective_findings if f.get("severity") == "CRITICAL"),
            "high_count":     sum(1 for f in detective_findings if f.get("severity") == "HIGH"),
            "medium_count":   sum(1 for f in detective_findings if f.get("severity") == "MEDIUM"),
            "low_count":      sum(1 for f in detective_findings if f.get("severity") == "LOW"),
            "false_positives_removed": 0,
        },
        "analysis_metadata": {
            "judge_confidence": 0.0,
            "analysis_timestamp": datetime.now(timezone.utc).isoformat(),
        },
        "findings": [
            {**f, "judge_verdict": "Pending review.", "plain_english_impact": f.get("detective_finding", ""),
             "recommendation": "NEGOTIATE", "negotiation_tip": "", "verified": True, "false_positive": False}
            for f in detective_findings
        ],
    }


def run_judge(contract_text: str, detective_findings: list[dict[str, Any]]) -> dict[str, Any]:
    client = get_client()
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

    response = call_gemini(
        client=client,
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
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return _fallback_report(detective_findings)
