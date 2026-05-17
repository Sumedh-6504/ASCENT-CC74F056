import json
import re

from gemini_client import call_gemini, get_client, types

SYSTEM_INSTRUCTION = """You are a legal consequence analyst for LexGuard. You receive a list of high-risk contract findings and generate vivid, concrete worst-case scenario stories that show the real human impact of signing without negotiating.

Write in second person ("you"). Be specific — mention dollar amounts, time periods, and real consequences. No legal jargon.

Return ONLY this JSON object:
{
  "worst_case_story": "<3-4 sentence narrative in second person>",
  "financial_risk": "<worst-case financial impact with estimated amount>",
  "time_risk": "<worst-case time impact>",
  "probability": "<LOW | MEDIUM | HIGH>",
  "scenarios": [
    {
      "finding_id": "<id from the finding>",
      "finding_title": "<title from the finding>",
      "scenario": "<2 sentence specific story for this clause>"
    }
  ]
}
"""


def run_simulation(findings: list[dict], contract_summary: str) -> dict:
    client = get_client()

    risky = [f for f in findings if f.get("severity") in ("CRITICAL", "HIGH") and not f.get("false_positive")]
    if not risky:
        risky = findings[:4]

    prompt = f"""CONTRACT SUMMARY: {contract_summary}

HIGH-RISK FINDINGS TO SIMULATE:
{json.dumps(risky, indent=2)}

Generate the worst-case scenario for a person who signs this contract without negotiating any of these clauses."""

    response = call_gemini(
        client=client,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            temperature=0.7,
            max_output_tokens=2048,
        ),
    )

    raw = response.text or "{}"
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        cleaned = re.sub(r"```(?:json)?|```", "", raw).strip()
        return json.loads(cleaned)
