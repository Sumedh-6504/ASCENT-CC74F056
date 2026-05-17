"use client";

import React, { useState } from "react";
import { Finding } from "../types/analysis";
import FindingCard from "./FindingCard";

interface FindingsListProps {
  findings: Finding[];
}

export default function FindingsList({ findings }: FindingsListProps) {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredFindings = findings.filter((f) => {
    // Only show verified non-false-positive findings by default
    if (f.false_positive) return false;
    
    if (filter === "ALL") return true;
    if (filter === "NEGOTIABLE") return f.recommendation === "NEGOTIATE";
    return f.severity === filter;
  });

  const filters = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGOTIABLE"];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              filter === f
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredFindings.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            No findings match this filter.
          </div>
        ) : (
          filteredFindings.map((finding, idx) => (
            <FindingCard key={finding.id || idx} finding={finding} />
          ))
        )}
      </div>
    </div>
  );
}
