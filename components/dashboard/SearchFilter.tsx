/**
 * SearchFilter — Search bar + risk level filter for the dashboard.
 *
 * Provides:
 *   - Text search (filters by document name)
 *   - Risk level pills (SAFE, LOW, MEDIUM, HIGH, CRITICAL)
 *   - Sort toggle (Newest First / Highest Risk)
 */

"use client";

import React from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { RISK_LEVELS } from "@/lib/constants";

export type SortMode = "newest" | "highest_risk";

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: string | null;
  onFilterChange: (level: string | null) => void;
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
}

const FILTER_LEVELS = Object.entries(RISK_LEVELS) as [string, { label: string; color: string }][];

export default function SearchFilter({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortMode,
  onSortChange,
}: SearchFilterProps) {
  return (
    <div className="space-y-3">
      {/* Search bar + Sort toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#5a8aaa" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search contracts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none"
            style={{
              background: "rgba(2,9,26,0.8)",
              border: "1px solid rgba(0,212,255,0.12)",
              color: "#b0cce0",
              caretColor: "#00d4ff",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.12)"; }}
          />
        </div>

        {/* Sort toggle */}
        <button
          onClick={() => onSortChange(sortMode === "newest" ? "highest_risk" : "newest")}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-bold tracking-wider whitespace-nowrap transition-all duration-200 hover:brightness-125"
          style={{
            background: "rgba(0,212,255,0.06)",
            border: "1px solid rgba(0,212,255,0.15)",
            color: "#6aaccf",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          {sortMode === "newest" ? "Newest" : "Risk ↓"}
        </button>
      </div>

      {/* Risk level filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* "All" pill */}
        <button
          onClick={() => onFilterChange(null)}
          className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200"
          style={{
            background: activeFilter === null ? "rgba(0,212,255,0.15)" : "rgba(0,212,255,0.04)",
            border: `1px solid ${activeFilter === null ? "rgba(0,212,255,0.4)" : "rgba(0,212,255,0.1)"}`,
            color: activeFilter === null ? "#00d4ff" : "#5a8aaa",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          All
        </button>

        {FILTER_LEVELS.map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => onFilterChange(activeFilter === key ? null : key)}
            className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200"
            style={{
              background: activeFilter === key ? `${color}20` : `${color}08`,
              border: `1px solid ${activeFilter === key ? `${color}60` : `${color}20`}`,
              color: activeFilter === key ? color : `${color}80`,
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
