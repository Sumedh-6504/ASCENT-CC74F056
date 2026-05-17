"use client";

import React from "react";
import { SummaryStats as Stats } from "../types/analysis";

interface SummaryStatsProps {
  stats: Stats;
}

const METRICS = [
  { key: "total_findings", label: "TOTAL",    color: "#00d4ff" },
  { key: "critical_count", label: "CRITICAL", color: "#ff2d55" },
  { key: "high_count",     label: "HIGH",     color: "#ff6b35" },
  { key: "medium_count",   label: "MEDIUM",   color: "#ffd60a" },
  { key: "low_count",      label: "LOW",      color: "#30d158" },
] as const;

export default function SummaryStats({ stats }: SummaryStatsProps) {
  return (
    <div className="space-y-3 print-card">
      <p
        className="text-center text-[10px] tracking-[0.35em] uppercase"
        style={{ color: "#2a4565", fontFamily: "var(--font-mono, monospace)" }}
      >
        ── Threat Assessment ──
      </p>

      <div className="grid grid-cols-5 gap-2">
        {METRICS.map(({ key, label, color }) => {
          const count = stats[key];
          const isActive = count > 0;
          return (
            <div
              key={key}
              className="relative rounded-xl p-3 text-center transition-all duration-300 hover:scale-105 cursor-default"
              style={{
                background: isActive ? `${color}12` : "rgba(10,20,40,0.5)",
                border:     `1px solid ${isActive ? `${color}40` : "rgba(30,50,80,0.5)"}`,
                boxShadow:  isActive ? `0 0 18px ${color}22` : "none",
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-1/4 right-1/4 h-[1px] rounded-full"
                style={{ background: color, opacity: isActive ? 0.7 : 0.2 }}
              />

              <span
                className="text-2xl font-black block"
                style={{
                  color,
                  opacity: isActive ? 1 : 0.3,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {count}
              </span>
              <span
                className="text-[9px] tracking-[0.22em] block mt-0.5"
                style={{
                  color,
                  opacity: isActive ? 0.6 : 0.25,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
