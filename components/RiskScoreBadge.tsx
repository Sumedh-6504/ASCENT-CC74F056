"use client";

import React from "react";
import { RiskLevel } from "../types/analysis";

interface RiskScoreBadgeProps {
  score: number; // 0-100
  level: RiskLevel;
}

export default function RiskScoreBadge({ score, level }: RiskScoreBadgeProps) {
  const getColor = () => {
    if (score < 20) return "text-emerald-500 stroke-emerald-500";
    if (score < 50) return "text-blue-500 stroke-blue-500";
    if (score < 75) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getGradient = () => {
    if (score < 20) return "from-emerald-500 to-emerald-400";
    if (score < 50) return "from-blue-500 to-blue-400";
    if (score < 75) return "from-amber-500 to-amber-400";
    return "from-rose-500 to-rose-400";
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90 absolute">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-100"
          />
          {/* Progress Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${getColor()}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-800">{score}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Risk Level</span>
        <div className={`px-4 py-1.5 rounded-full text-white font-bold text-sm bg-gradient-to-r ${getGradient()} shadow-sm`}>
          {level}
        </div>
      </div>
    </div>
  );
}
