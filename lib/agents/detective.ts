import { geminiModel } from "../vertexai";
import { Finding } from "../../types/analysis";

const DETECTIVE_SYSTEM_INSTRUCTION = `
You are the LexGuard Detective Agent. Your objective is to read a legal contract and extract potentially risky, unfair, or dangerous clauses.
Output your findings strictly as a JSON array of objects.

For each finding, extract:
- id: A unique string identifier (e.g., "finding-1")
- clause_text: The exact text of the clause
- clause_location: Where it was found (e.g., "Section 3.2")
- category: One of "AUTO_RENEWAL_TRAP", "DATA_EXPLOITATION", "UNILATERAL_CHANGE", "ARBITRATION_WAIVER", "INDEMNIFICATION_OVERREACH", "LIABILITY_CAP_ABUSE", "IP_GRAB", "TERMINATION_PENALTY", "CONFIDENTIALITY_OVERREACH", "HIDDEN_FEE", "GOVERNING_LAW_TRAP", "AMBIGUITY_RISK", "OTHER_RISK"
- title: A short, descriptive title
- detective_finding: Your analysis of why this clause is problematic

Leave the following fields empty or with default values (the Judge Agent will fill them):
- severity: "LOW"
- judge_verdict: ""
- plain_english_impact: ""
- recommendation: "ACCEPT"
- negotiation_tip: ""
- verified: false
- false_positive: false

Output ONLY a JSON array of findings. Do not include markdown formatting or explanation.
`;

export async function detective(contractText: string): Promise<Partial<Finding>[]> {
  const prompt = `
    ${DETECTIVE_SYSTEM_INSTRUCTION}

    CONTRACT TEXT:
    ---
    ${contractText}
    ---
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
    // Clean potential markdown from response if the model didn't respect the response_mime_type perfectly
    const cleanJson = responseText.replace(/^\s*```json/m, '').replace(/```\s*$/m, '').trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Detective agent failed:", error);
    throw new Error("Failed to analyze contract with Detective agent.");
  }
}
