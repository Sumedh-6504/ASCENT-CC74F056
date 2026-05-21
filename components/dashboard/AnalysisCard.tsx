/**
 * AnalysisCard — Dashboard grid card for a past analysis.
 *
 * Displays a compact summary of a single analysis:
 *   - Risk score badge (color-coded)
 *   - Document name and type
 *   - Finding counts by severity
 *   - Date analyzed
 *
 * Clickable — navigates to the full analysis detail page.
 */

"use client";

import React from "react";
import Link from "next/link";
import { FileText, AlertTriangle, Clock, Trash2 } from "lucide-react";
import { ROUTES, RISK_LEVELS } from "@/lib/constants";

interface AnalysisCardProps {
  analysis: {
    id: string;
    document_name: string;
    document_type: string | null;
    overall_risk_score: number;
    risk_level: string;
    summary_stats: Record<string, number>;
    created_at: string;
  };
  onDelete?: (id: string) => void;
}

export default function AnalysisCard({ analysis, onDelete }: AnalysisCardProps) {
  const risk = RISK_LEVELS[analysis.risk_level as keyof typeof RISK_LEVELS] ?? RISK_LEVELS.SAFE;
  const stats = analysis.summary_stats;

  return (
    <Link
      href={ROUTES.ANALYSIS(analysis.id)}
      className="block rounded-2xl p-5 transition-all duration-300 hover:translate-y-[-3px] hover:shadow-lg group relative"
      style={{
        background: "rgba(4,14,34,0.7)",
        border: `1px solid ${risk.color}25`,
        backdropFilter: "blur(16px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top glow bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{
          background: `linear-gradient(to right, ${risk.color}, ${risk.color}60, transparent)`,
        }}
      />

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(analysis.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          style={{
            background: "rgba(255,45,85,0.1)",
            border: "1px solid rgba(255,45,85,0.2)",
            color: "#ff6080",
          }}
          aria-label="Delete analysis"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="flex items-start gap-4">
        {/* Risk Score Badge */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center"
          style={{
            background: `${risk.color}12`,
            border: `1px solid ${risk.color}30`,
          }}
        >
          <span className="text-xl font-black" style={{ color: risk.color }}>
            {analysis.overall_risk_score}
          </span>
          <span
            className="text-[8px] font-bold tracking-[0.15em] uppercase"
            style={{ color: risk.color, opacity: 0.7 }}
          >
            {risk.label}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h3 className="text-sm font-bold truncate" style={{ color: "#e0ecf4" }}>
              {analysis.document_name}
            </h3>
            {analysis.document_type && (
              <span
                className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase"
                style={{
                  color: "#5a8aaa",
                  background: "rgba(15,30,60,0.6)",
                  border: "1px solid rgba(30,55,90,0.4)",
                }}
              >
                <FileText className="w-2.5 h-2.5" />
                {analysis.document_type.replace(/_/g, " ")}
              </span>
            )}
          </div>

          {/* Finding counts */}
          <div className="flex items-center gap-3">
            {stats.critical_count > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#ff2d55" }}>
                <AlertTriangle className="w-3 h-3" />
                {stats.critical_count} critical
              </span>
            )}
            {stats.high_count > 0 && (
              <span className="text-[10px] font-bold" style={{ color: "#ff6b35" }}>
                {stats.high_count} high
              </span>
            )}
            {stats.total_findings > 0 && (
              <span className="text-[10px] font-mono" style={{ color: "#5a8aaa" }}>
                {stats.total_findings} total
              </span>
            )}
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" style={{ color: "#3a6a88" }} />
            <span className="text-[10px] font-mono" style={{ color: "#3a6a88" }}>
              {new Date(analysis.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
