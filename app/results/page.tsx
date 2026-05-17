"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContractAnalysis } from "../../types/analysis";
import RiskScoreBadge from "../../components/RiskScoreBadge";
import SummaryStats from "../../components/SummaryStats";
import FindingsList from "../../components/FindingsList";
import { ArrowLeft, FileText, ShieldAlert } from "lucide-react";

export default function Results() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("lexguard_results");
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnalysis(JSON.parse(data));
    } else {
      router.push("/");
    }
  }, [router]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-xl text-slate-500 font-bold">Loading results...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" />
            <span className="font-black text-xl tracking-tight text-slate-800">LexGuard</span>
          </div>
          <button 
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Analyze Another</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 mt-10 space-y-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center gap-10 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex-shrink-0">
            <RiskScoreBadge score={analysis.overall_risk_score} level={analysis.risk_level} />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200">
              <FileText className="w-3 h-3" />
              <span>{analysis.document_type.replace(/_/g, " ")}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 leading-tight">
              Contract Summary
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {analysis.contract_summary}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div>
          <SummaryStats stats={analysis.summary_stats} />
        </div>

        {/* Findings Section */}
        <div className="pt-6 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Detailed Findings</h2>
          <FindingsList findings={analysis.findings} />
        </div>

      </div>
    </main>
  );
}
