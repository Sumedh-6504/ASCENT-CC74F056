"use client";

import React, { useState } from "react";
import { ContractAnalysis } from "../types/analysis";
import { Zap, Clock, DollarSign, TrendingDown, X } from "lucide-react";

interface SimulatePanelProps {
  analysis: ContractAnalysis;
}

interface ScenarioItem {
  finding_id: string;
  finding_title: string;
  scenario: string;
}

interface SimulationResult {
  worst_case_story: string;
  financial_risk: string;
  time_risk: string;
  probability: "LOW" | "MEDIUM" | "HIGH";
  scenarios: ScenarioItem[];
}

const PROB_STYLES = {
  HIGH: "text-rose-700 bg-rose-50 border-rose-200",
  MEDIUM: "text-amber-700 bg-amber-50 border-amber-200",
  LOW: "text-blue-700 bg-blue-50 border-blue-200",
};

export default function SimulatePanel({ analysis }: SimulatePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          findings: analysis.findings,
          contract_summary: analysis.contract_summary,
        }),
      });

      if (!res.ok) throw new Error("Simulation failed");
      setResult(await res.json());
    } catch {
      setError("Simulation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={runSimulation}
        className="no-print w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
      >
        <Zap className="w-5 h-5" />
        <span>Simulate Worst-Case Scenario</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 to-orange-500 p-6 rounded-t-3xl flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-white">Worst-Case Scenario</h2>
                <p className="text-rose-100 text-sm mt-1">
                  What happens if you sign without negotiating
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors mt-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin" />
                  <p className="text-slate-500 font-medium">Generating scenarios...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              {result && (
                <>
                  {/* Narrative */}
                  <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-r-2xl">
                    <p className="text-xs font-black text-rose-600 uppercase tracking-wider mb-2">
                      The Story
                    </p>
                    <p className="text-slate-800 leading-relaxed font-medium text-[15px]">
                      {result.worst_case_story}
                    </p>
                  </div>

                  {/* Risk Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                      <DollarSign className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Financial Risk
                      </p>
                      <p className="text-sm font-bold text-slate-800">{result.financial_risk}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                      <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Time Risk
                      </p>
                      <p className="text-sm font-bold text-slate-800">{result.time_risk}</p>
                    </div>
                    <div
                      className={`rounded-xl p-4 text-center border ${PROB_STYLES[result.probability] ?? PROB_STYLES.MEDIUM}`}
                    >
                      <TrendingDown className="w-5 h-5 mx-auto mb-1 opacity-60" />
                      <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-60">
                        Likelihood
                      </p>
                      <p className="text-sm font-black">{result.probability}</p>
                    </div>
                  </div>

                  {/* Per-clause scenarios */}
                  {result.scenarios?.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        Per-Clause Scenarios
                      </p>
                      {result.scenarios.map((s, i) => (
                        <div
                          key={i}
                          className="bg-orange-50 border border-orange-100 rounded-xl p-4"
                        >
                          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                            {s.finding_title}
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">{s.scenario}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
