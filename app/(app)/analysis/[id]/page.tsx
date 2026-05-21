/**
 * Analysis Detail Page — Persistent, shareable analysis results.
 *
 * Replaces the old /results page that used sessionStorage.
 * Fetches the analysis from Supabase by ID and verifies ownership.
 * Renders the same beautiful results UI (RiskScoreBadge, SummaryStats,
 * FindingsList, SimulatePanel).
 */

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ContractAnalysis } from "@/types/analysis";
import RiskScoreBadge from "@/components/RiskScoreBadge";
import SummaryStats from "@/components/SummaryStats";
import FindingsList from "@/components/FindingsList";
import SimulatePanel from "@/components/SimulatePanel";
import { ArrowLeft, Download, FileText, ShieldAlert, LayoutDashboard } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch(`/api/analyses/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Analysis not found.");
          } else {
            setError("Failed to load analysis.");
          }
          return;
        }
        const data = await res.json();
        setAnalysis(data);
      } catch {
        setError("Failed to load analysis.");
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchAnalysis();
    }
  }, [params.id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(0,212,255,0.3)", borderTopColor: "#00d4ff" }}
          />
          <span
            className="text-sm tracking-[0.25em] uppercase"
            style={{ color: "#00d4ff", fontFamily: "var(--font-mono, monospace)" }}
          >
            Loading analysis...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !analysis) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center gap-4">
        <ShieldAlert className="w-10 h-10" style={{ color: "#5a8aaa" }} />
        <p className="text-lg font-bold" style={{ color: "#c8d8e8" }}>
          {error || "Analysis not found"}
        </p>
        <button
          onClick={() => router.push(ROUTES.DASHBOARD)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ color: "#00d4ff" }}
        >
          <LayoutDashboard className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 relative overflow-x-hidden">
      {/* Ambient glow blobs */}
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

      {/* Action bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 hover:scale-105"
            style={{
              color: "#a0d4f0",
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.25)",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => window.print()}
            className="no-print flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 hover:scale-105"
            style={{
              color: "#a0d4f0",
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.25)",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mt-6 space-y-8">
        {/* Hero card: Score + Summary */}
        <div
          className="flex flex-col md:flex-row items-center gap-8 rounded-2xl p-7 glass-card animate-fade-up"
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
                <span className="text-[10px] font-semibold font-mono tracking-wider" style={{ color: "#6a9ab8" }}>
                  Confidence: {Math.round(analysis.analysis_metadata.judge_confidence * 100)}%
                </span>
                <span className="text-[10px] font-semibold font-mono tracking-wider" style={{ color: "#6a9ab8" }}>
                  {new Date(analysis.analysis_metadata.analysis_timestamp).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div
          className="rounded-2xl p-5 glass-card animate-fade-up"
          style={{
            animationDelay: "80ms",
            background: "rgba(4,14,34,0.6)",
            border: "1px solid rgba(0,212,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
        >
          <SummaryStats stats={analysis.summary_stats} />
        </div>

        {/* Simulate */}
        {analysis.findings.length > 0 && (
          <div className="no-print animate-fade-up" style={{ animationDelay: "120ms" }}>
            <SimulatePanel analysis={analysis} />
          </div>
        )}

        {/* Findings */}
        <div className="space-y-5 animate-fade-up" style={{ animationDelay: "160ms" }}>
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
    </div>
  );
}
