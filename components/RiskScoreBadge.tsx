"use client";

import React from "react";
import { RiskLevel } from "../types/analysis";

interface RiskScoreBadgeProps {
  score: number;
  level: RiskLevel;
}

const LEVEL_CONFIG: Record<string, { color: string; label: string }> = {
  SAFE:     { color: "#00d4ff", label: "SAFE"     },
  LOW:      { color: "#30d158", label: "LOW RISK" },
  MEDIUM:   { color: "#ffd60a", label: "MEDIUM"   },
  HIGH:     { color: "#ff6b35", label: "HIGH RISK" },
  CRITICAL: { color: "#ff2d55", label: "CRITICAL" },
};

export default function RiskScoreBadge({ score, level }: RiskScoreBadgeProps) {
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.MEDIUM;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className="flex flex-col items-center justify-center p-6 rounded-2xl print-card"
      style={{
        background: "rgba(4,14,34,0.7)",
        border: `1px solid ${cfg.color}30`,
        boxShadow: `0 0 30px ${cfg.color}18`,
        backdropFilter: "blur(16px)",
        minWidth: 180,
      }}
    >
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 160 160">
          {/* Track */}
          <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          {/* Progress */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={cfg.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)",
              filter: `drop-shadow(0 0 8px ${cfg.color}80)`,
            }}
          />
        </svg>

        {/* Inner glow */}
        <div
          className="absolute inset-6 rounded-full"
          style={{ background: `radial-gradient(ellipse at center, ${cfg.color}10 0%, transparent 70%)` }}
        />

        <div className="relative flex flex-col items-center">
          <span
            className="text-4xl font-black leading-none"
            style={{ color: cfg.color, fontFamily: "var(--font-mono, monospace)" }}
          >
            {score}
          </span>
          <span
            className="text-[9px] tracking-[0.2em] mt-0.5"
            style={{ color: `${cfg.color}70`, fontFamily: "var(--font-mono, monospace)" }}
          >
            / 100
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-1">
        <span
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{ color: "#2a4060", fontFamily: "var(--font-mono, monospace)" }}
        >
          Risk Level
        </span>
        <span
          className="px-4 py-1 rounded-full text-xs font-black tracking-widest"
          style={{
            color: cfg.color,
            background: `${cfg.color}15`,
            border: `1px solid ${cfg.color}35`,
            boxShadow: `0 0 12px ${cfg.color}25`,
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          {cfg.label}
        </span>
      </div>
    </div>
  );
}
