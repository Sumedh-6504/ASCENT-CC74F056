import { geminiModel } from "../vertexai";
import { ContractAnalysis, Finding } from "../../types/analysis";

const JUDGE_SYSTEM_INSTRUCTION = `
You are the LexGuard Judge Agent. Your objective is to review the initial findings from the Detective Agent against the full contract text. 
You must score the risks, determine severity, and provide actionable negotiation advice. 

You must output a complete JSON object matching the ContractAnalysis schema.

The input will contain:
1. The full contract text.
2. The initial findings from the Detective.

For each finding, you must determine:
- judge_verdict: Detailed explanation of the risk and your ruling.
- plain_english_impact: A simple, 1-2 sentence explanation of how this hurts the user.
- recommendation: "ACCEPT", "NEGOTIATE", or "REJECT".
- negotiation_tip: Actionable advice on how to push back or what language to suggest.
- severity: "CRITICAL", "HIGH", "MEDIUM", or "LOW".
- verified: true (if you agree with the detective)
- false_positive: true (if the detective was wrong; if so, you can filter it out or keep it with false_positive = true)

You must also generate:
- document_type: Identify the type of document.
- contract_summary: A 2-3 sentence overall summary.
- overall_risk_score: 0-100 (100 being extremely risky).
- risk_level: "SAFE", "LOW", "MEDIUM", "HIGH", or "CRITICAL".
- summary_stats: Count of findings by severity (exclude false positives).
- analysis_metadata: judge_confidence (0-1) and analysis_timestamp.

Output ONLY a single JSON object. No markdown formatting outside of the JSON.
`;

export async function judge(contractText: string, detectiveFindings: Partial<Finding>[]): Promise<ContractAnalysis> {
  const prompt = `
    ${JUDGE_SYSTEM_INSTRUCTION}

    DETECTIVE FINDINGS:
    ---
    ${JSON.stringify(detectiveFindings, null, 2)}
    ---

    CONTRACT TEXT:
    ---
    ${contractText}
    ---
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Clean potential markdown
    const cleanJson = responseText.replace(/^\s*```json/m, '').replace(/```\s*$/m, '').trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Judge agent failed:", error);
    throw new Error("Failed to analyze findings with Judge agent.");
  }
}
