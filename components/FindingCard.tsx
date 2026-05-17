"use client";

import React, { useState } from "react";
import { Finding } from "../types/analysis";
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";

interface FindingCardProps {
  finding: Finding;
  index?: number;
}

const SEV: Record<string, { color: string; bg: string; border: string; glow: string; label: string }> = {
  CRITICAL: { color: "#ff2d55", bg: "rgba(255,45,85,0.09)",  border: "rgba(255,45,85,0.38)",  glow: "card-critical", label: "CRITICAL" },
  HIGH:     { color: "#ff6b35", bg: "rgba(255,107,53,0.08)", border: "rgba(255,107,53,0.32)", glow: "card-high",     label: "HIGH"     },
  MEDIUM:   { color: "#ffd60a", bg: "rgba(255,214,10,0.07)", border: "rgba(255,214,10,0.28)", glow: "",              label: "MEDIUM"   },
  LOW:      { color: "#30d158", bg: "rgba(48,209,88,0.07)",  border: "rgba(48,209,88,0.25)",  glow: "",              label: "LOW"      },
};

const REC: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  ACCEPT:    { color: "#30d158", bg: "rgba(48,209,88,0.1)",   icon: <CheckCircle className="w-3 h-3" />,   label: "ACCEPT"    },
  NEGOTIATE: { color: "#ffd60a", bg: "rgba(255,214,10,0.09)", icon: <AlertTriangle className="w-3 h-3" />, label: "NEGOTIATE" },
  REJECT:    { color: "#ff2d55", bg: "rgba(255,45,85,0.1)",   icon: <XCircle className="w-3 h-3" />,       label: "REJECT"    },
};

export default function FindingCard({ finding, index = 0 }: FindingCardProps) {
  const [isExpanded,  setIsExpanded]  = useState(false);
  const [tipExpanded, setTipExpanded] = useState(false);

  const sev = SEV[finding.severity] ?? SEV.LOW;
  const rec = REC[finding.recommendation];

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px] print-card glass-card animate-fade-up ${sev.glow}`}
      style={{
        animationDelay: `${index * 60}ms`,
        background: "rgba(4,14,34,0.7)",
        border: `1px solid ${sev.border}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4)`,
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Severity top bar */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(to right, ${sev.color}, ${sev.color}80, transparent)` }} />

      {/* Corner brackets */}
      <div className="absolute top-3 left-3 w-4 h-4" style={{ borderTop: `1px solid ${sev.color}50`, borderLeft: `1px solid ${sev.color}50` }} />
      <div className="absolute top-3 right-3 w-4 h-4" style={{ borderTop: `1px solid ${sev.color}50`, borderRight: `1px solid ${sev.color}50` }} />
      <div className="absolute bottom-3 left-3 w-4 h-4" style={{ borderBottom: `1px solid ${sev.color}50`, borderLeft: `1px solid ${sev.color}50` }} />
      <div className="absolute bottom-3 right-3 w-4 h-4" style={{ borderBottom: `1px solid ${sev.color}50`, borderRight: `1px solid ${sev.color}50` }} />

      <div className="p-6 space-y-4">

        {/* ── Header ── */}
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              {/* Severity badge */}
              <span
                className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-[0.18em] print-severity"
                style={{ color: sev.color, background: sev.bg, border: `1px solid ${sev.border}` }}
              >
                {sev.label}
              </span>
              {/* Category */}
              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase"
                style={{ color: "#5a7a9a", background: "rgba(15,30,60,0.6)", border: "1px solid rgba(30,55,90,0.5)" }}
              >
                {finding.category.replace(/_/g, " ")}
              </span>
            </div>
            <h3 className="text-lg font-bold leading-snug" style={{ color: "#e8f4ff" }}>
              {finding.title}
            </h3>
          </div>

          {/* Recommendation badge */}
          {rec && (
            <span
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
              style={{ color: rec.color, background: rec.bg, border: `1px solid ${rec.color}35` }}
            >
              {rec.icon}
              {rec.label}
            </span>
          )}
        </div>

        {/* ── Clause text ── */}
        <div
          className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:brightness-110"
          style={{ background: "rgba(2,9,26,0.7)", border: "1px solid rgba(0,212,255,0.08)" }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex justify-between items-center mb-2">
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono"
              style={{ color: "#6aaacC" }}
            >
              Clause · {finding.clause_location}
            </span>
            {isExpanded
              ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#6aaacC" }} />
              : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#6aaacC" }} />}
          </div>
          <p
            className={`text-sm leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}
            style={{ color: "#a8c8e0", fontFamily: "var(--font-mono, monospace)" }}
          >
            &ldquo;{finding.clause_text}&rdquo;
          </p>
        </div>

        {/* ── Detective | Judge ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(10,20,50,0.5)", border: "1px solid rgba(30,60,100,0.4)" }}
          >
            <p
              className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2"
              style={{ color: "#6aaacC", fontFamily: "var(--font-mono, monospace)" }}
            >
              Detective Finding
            </p>
            <p className="text-sm italic leading-relaxed font-medium" style={{ color: "#a0bcd4" }}>
              &ldquo;{finding.detective_finding}&rdquo;
            </p>
          </div>
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(10,20,50,0.5)", border: "1px solid rgba(30,60,100,0.4)" }}
          >
            <p
              className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2"
              style={{ color: "#6aaacC", fontFamily: "var(--font-mono, monospace)" }}
            >
              Judge Verdict
            </p>
            <p className="text-sm leading-relaxed font-medium" style={{ color: "#b8d0e8" }}>
              {finding.judge_verdict}
            </p>
          </div>
        </div>

        {/* ── Plain English Impact ── */}
        <div
          className="rounded-r-xl p-4"
          style={{
            background: `${sev.color}0d`,
            borderLeft: `3px solid ${sev.color}`,
            borderTop: `1px solid ${sev.color}22`,
            borderRight: `1px solid ${sev.color}22`,
            borderBottom: `1px solid ${sev.color}22`,
          }}
        >
          <p
            className="text-[10px] font-bold tracking-[0.25em] uppercase mb-1.5 font-mono"
            style={{ color: sev.color }}
          >
            Plain English Impact
          </p>
          <p className="text-sm font-semibold leading-relaxed" style={{ color: sev.color, opacity: 0.92 }}>
            {finding.plain_english_impact}
          </p>
        </div>

        {/* ── Negotiation Tip ── */}
        {(finding.recommendation === "NEGOTIATE" || finding.recommendation === "REJECT") && finding.negotiation_tip && (
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(0,212,255,0.15)" }}
          >
            <button
              className="w-full px-4 py-3 flex justify-between items-center transition-all duration-200 text-left hover:brightness-110"
              style={{ background: "rgba(0,212,255,0.06)" }}
              onClick={() => setTipExpanded(!tipExpanded)}
            >
              <span className="flex items-center gap-2 text-xs font-bold tracking-wider" style={{ color: "#00d4ff" }}>
                <AlertTriangle className="w-3.5 h-3.5" />
                Negotiation Tip
              </span>
              {tipExpanded
                ? <ChevronUp className="w-3.5 h-3.5"  style={{ color: "#00d4ff" }} />
                : <ChevronDown className="w-3.5 h-3.5" style={{ color: "#00d4ff" }} />}
            </button>
            {tipExpanded && (
              <div
                className="px-4 py-3 text-sm leading-relaxed"
                style={{
                  background: "rgba(2,9,26,0.6)",
                  color: "#a0c8e4",
                  borderTop: "1px solid rgba(0,212,255,0.2)",
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 500,
                }}
              >
                {finding.negotiation_tip}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
