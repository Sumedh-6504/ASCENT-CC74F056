"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContractAnalysis } from "../../types/analysis";
import RiskScoreBadge from "../../components/RiskScoreBadge";
import SummaryStats from "../../components/SummaryStats";
import FindingsList from "../../components/FindingsList";
import SimulatePanel from "../../components/SimulatePanel";
import { ArrowLeft, Download, FileText, ShieldAlert } from "lucide-react";

export default function Results() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("lexguard_results");
    if (data) {
      setAnalysis(JSON.parse(data));
    } else {
      router.push("/");
    }
  }, [router]);

  if (!analysis) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-deep, #02091a)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(0,212,255,0.3)", borderTopColor: "#00d4ff" }}
          />
          <span
            className="text-sm tracking-[0.25em] uppercase"
            style={{ color: "#00d4ff", fontFamily: "var(--font-mono, monospace)" }}
          >
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen pb-24 relative overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #02091a 0%, #040e22 50%, #020c1e 100%)" }}
    >
      {/* ── Ambient glow blobs ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-5%", left: "-8%",
          width: "45%", height: "45%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,100,200,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "10%", right: "-5%",
          width: "35%", height: "35%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,45,85,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "40%", left: "55%",
          width: "30%", height: "30%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Sticky Header ── */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: "rgba(2,9,26,0.75)",
          borderBottom: "1px solid rgba(0,212,255,0.1)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="p-1.5 rounded-lg"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}
            >
              <ShieldAlert className="w-4 h-4" style={{ color: "#00d4ff" }} />
            </div>
            <span
              className="font-black text-base tracking-[0.12em]"
              style={{ color: "#c8d8e8" }}
            >
              LexGuard
            </span>
            <span
              className="hidden sm:block text-[9px] tracking-[0.25em] uppercase px-2 py-0.5 rounded"
              style={{
                color: "#00d4ff",
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.15)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              Analysis Complete
            </span>
          </div>

          <div className="no-print flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-all duration-200 hover:scale-105"
              style={{
                color: "#a0d4f0",
                background: "rgba(0,212,255,0.12)",
                border: "1px solid rgba(0,212,255,0.4)",
                boxShadow: "0 0 12px rgba(0,212,255,0.1)",
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-all duration-200 hover:scale-105"
              style={{
                color: "#a0d4f0",
                background: "rgba(0,212,255,0.12)",
                border: "1px solid rgba(0,212,255,0.4)",
                boxShadow: "0 0 12px rgba(0,212,255,0.1)",
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Analysis</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Print-only header ── */}
      <div className="print-header hidden px-8 pt-6 pb-4 mb-6" style={{ borderBottom: "1px solid #e2e8f0" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-black text-2xl text-slate-800">LexGuard</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Contract Intelligence Report
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Generated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          &nbsp;— For informational purposes only. Not legal advice.
        </p>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-8">

        {/* ── Hero card: Score + Summary ── */}
        <div
          className="flex flex-col md:flex-row items-center gap-8 rounded-2xl p-7 print-card glass-card animate-fade-up"
          style={{
            background: "rgba(4,14,34,0.7)",
            border: "1px solid rgba(0,212,255,0.12)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex-shrink-0">
            <RiskScoreBadge score={analysis.overall_risk_score} level={analysis.risk_level} />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono tracking-[0.2em] uppercase"
                style={{
                  color: "#00d4ff",
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
              >
                <FileText className="w-3 h-3" />
                {analysis.document_type.replace(/_/g, " ")}
              </span>
            </div>

            <div>
              <p
                className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2"
                style={{ color: "#5aadce", fontFamily: "var(--font-mono, monospace)" }}
              >
                Contract Summary
              </p>
              <p className="text-base font-medium leading-relaxed" style={{ color: "#c0d8ec" }}>
                {analysis.contract_summary}
              </p>
            </div>

            {analysis.analysis_metadata && (
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <span
                  className="text-[10px] font-semibold font-mono tracking-wider"
                  style={{ color: "#6a9ab8" }}
                >
                  Confidence: {Math.round(analysis.analysis_metadata.judge_confidence * 100)}%
                </span>
                <span
                  className="text-[10px] font-semibold font-mono tracking-wider"
                  style={{ color: "#6a9ab8" }}
                >
                  {new Date(analysis.analysis_metadata.analysis_timestamp).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div
          className="rounded-2xl p-5 print-card glass-card animate-fade-up"
          style={{
            animationDelay: "80ms",
            background: "rgba(4,14,34,0.6)",
            border: "1px solid rgba(0,212,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
        >
          <SummaryStats stats={analysis.summary_stats} />
        </div>

        {/* ── Simulate Button ── */}
        {analysis.findings.length > 0 && (
          <div className="no-print animate-fade-up" style={{ animationDelay: "120ms" }}>
            <SimulatePanel analysis={analysis} />
          </div>
        )}

        {/* ── Findings ── */}
        <div
          className="space-y-5 animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <div className="flex items-center gap-4 pt-2">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(0,212,255,0.2), transparent)" }} />
            <h2
              className="text-xs font-bold tracking-[0.3em] uppercase"
              style={{ color: "#7ac8e8", fontFamily: "var(--font-mono, monospace)" }}
            >
              Detailed Findings
            </h2>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, rgba(0,212,255,0.2), transparent)" }} />
          </div>

          <FindingsList findings={analysis.findings} />
        </div>

      </div>
    </main>
  );
}
