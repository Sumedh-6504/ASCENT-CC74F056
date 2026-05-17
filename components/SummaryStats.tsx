"use client";

import React from "react";
import { SummaryStats as Stats } from "../types/analysis";

interface SummaryStatsProps {
  stats: Stats;
}

export default function SummaryStats({ stats }: SummaryStatsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <div className="px-4 py-2 bg-slate-100 rounded-lg flex flex-col items-center min-w-[100px]">
        <span className="text-2xl font-black text-slate-700">{stats.total_findings}</span>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
      </div>
      <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-lg flex flex-col items-center min-w-[100px]">
        <span className="text-2xl font-black text-rose-600">{stats.critical_count}</span>
        <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Critical</span>
      </div>
      <div className="px-4 py-2 bg-orange-50 border border-orange-100 rounded-lg flex flex-col items-center min-w-[100px]">
        <span className="text-2xl font-black text-orange-600">{stats.high_count}</span>
        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">High</span>
      </div>
      <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg flex flex-col items-center min-w-[100px]">
        <span className="text-2xl font-black text-amber-600">{stats.medium_count}</span>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Medium</span>
      </div>
      <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg flex flex-col items-center min-w-[100px]">
        <span className="text-2xl font-black text-blue-600">{stats.low_count}</span>
        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Low</span>
      </div>
    </div>
  );
}
