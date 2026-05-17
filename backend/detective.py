import json
import re
from typing import Any

from gemini_client import call_gemini, get_client, types

SYSTEM_INSTRUCTION = """You are the LexGuard Detective Agent. Read the legal contract and extract every potentially risky, exploitative, or hidden clause.

Output ONLY a JSON array — no prose, no markdown, nothing outside the JSON array.

For each finding include these exact fields:
{
  "id": "finding-1",
  "clause_text": "<verbatim quote, max 300 chars>",
  "clause_location": "<section or paragraph, e.g. Section 3.2>",
  "category": "<one of: AUTO_RENEWAL_TRAP | DATA_EXPLOITATION | UNILATERAL_CHANGE | ARBITRATION_WAIVER | INDEMNIFICATION_OVERREACH | LIABILITY_CAP_ABUSE | IP_GRAB | TERMINATION_PENALTY | CONFIDENTIALITY_OVERREACH | HIDDEN_FEE | GOVERNING_LAW_TRAP | AMBIGUITY_RISK | NON_COMPETE_RESTRICTION | OTHER_RISK>",
  "severity": "<CRITICAL | HIGH | MEDIUM | LOW>",
  "title": "<5-word max descriptive title>",
  "detective_finding": "<2-3 sentences plain English explaining why this clause is dangerous>",
  "judge_verdict": "",
  "plain_english_impact": "",
  "recommendation": "ACCEPT",
  "negotiation_tip": "",
  "verified": false,
  "false_positive": false
}

Severity rules:
- CRITICAL: Causes financial loss, legal action risk, IP transfer, or permanent rights waiver
- HIGH: Major unfairness, hard to reverse, or significant hidden obligation
- MEDIUM: Common but unfair; user should try to negotiate
- LOW: Minor imbalance or vague language worth flagging

If no risky clauses are found, return an empty array [].
"""


def run_detective(contract_text: str) -> list[dict[str, Any]]:
    client = get_client()
    truncated = contract_text[:20000]

    response = call_gemini(
        client=client,
        contents=f"Analyze this contract and return the JSON array of findings:\n\n---\n{truncated}\n---",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            temperature=0.1,
            max_output_tokens=4096,
        ),
    )

    raw = response.text or "[]"
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        cleaned = re.sub(r"```(?:json)?|```", "", raw).strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return []
