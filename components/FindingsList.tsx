"use client";

import React, { useState } from "react";
import { Finding } from "../types/analysis";
import FindingCard from "./FindingCard";

interface FindingsListProps {
  findings: Finding[];
}

const FILTER_COLORS: Record<string, string> = {
  ALL:        "#00d4ff",
  CRITICAL:   "#ff2d55",
  HIGH:       "#ff6b35",
  MEDIUM:     "#ffd60a",
  LOW:        "#30d158",
  NEGOTIABLE: "#a78bfa",
};

const FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGOTIABLE"] as const;

export default function FindingsList({ findings }: FindingsListProps) {
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = findings.filter((f) => {
    if (f.false_positive) return false;
    if (filter === "ALL")        return true;
    if (filter === "NEGOTIABLE") return f.recommendation === "NEGOTIATE";
    return f.severity === filter;
  });

  const countFor = (f: string) => {
    if (f === "ALL")        return findings.filter((x) => !x.false_positive).length;
    if (f === "NEGOTIABLE") return findings.filter((x) => !x.false_positive && x.recommendation === "NEGOTIATE").length;
    return findings.filter((x) => !x.false_positive && x.severity === f).length;
  };

  return (
    <div className="w-full space-y-6">

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap gap-2 justify-center">
        {FILTERS.map((f) => {
          const color   = FILTER_COLORS[f];
          const isActive = filter === f;
          const count   = countFor(f);

          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold font-mono tracking-[0.15em] uppercase transition-all duration-200 hover:scale-105 active:scale-100"
              style={{
                background: isActive ? `${color}22` : "rgba(10,28,58,0.8)",
                border:     `1px solid ${isActive ? `${color}70` : "rgba(0,212,255,0.2)"}`,
                color:      isActive ? color : "#8ab8d8",
                boxShadow:  isActive ? `0 0 18px ${color}35` : "none",
              }}
            >
              <span>{f}</span>
              {count > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-black"
                  style={{
                    background: isActive ? `${color}30` : "rgba(0,212,255,0.12)",
                    color:      isActive ? color : "#7ab0d0",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Cards ── */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div
            className="text-center py-14 rounded-2xl"
            style={{
              background: "rgba(4,14,34,0.5)",
              border: "1px dashed rgba(30,55,90,0.4)",
              color: "#6a9ab8",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
            }}
          >
            [ NO FINDINGS MATCH THIS FILTER ]
          </div>
        ) : (
          filtered.map((finding, idx) => (
            <FindingCard key={finding.id || idx} finding={finding} index={idx} />
          ))
        )}
      </div>
    </div>
  );
}
