"use client";

import React, { useState } from "react";
import { Finding } from "../types/analysis";
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";

interface FindingCardProps {
  finding: Finding;
}

export default function FindingCard({ finding }: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tipExpanded, setTipExpanded] = useState(false);

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-rose-100 text-rose-700 border-rose-200";
      case "HIGH": return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM": return "bg-amber-100 text-amber-700 border-amber-200";
      case "LOW": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case "ACCEPT":
        return <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold"><CheckCircle className="w-3 h-3" /><span>ACCEPT</span></span>;
      case "NEGOTIATE":
        return <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold"><AlertTriangle className="w-3 h-3" /><span>NEGOTIATE</span></span>;
      case "REJECT":
        return <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold"><XCircle className="w-3 h-3" /><span>REJECT</span></span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider border ${getSeverityColors(finding.severity)}`}>
              {finding.severity}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
              {finding.category.replace(/_/g, " ")}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">{finding.title}</h3>
        </div>
        {getRecommendationBadge(finding.recommendation)}
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clause Text ({finding.clause_location})</span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
        <div className={`mt-2 font-mono text-sm text-slate-700 ${isExpanded ? "" : "line-clamp-2"}`}>
          &quot;{finding.clause_text}&quot;
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Detective Finding</h4>
          <p className="text-sm text-slate-600 italic">&quot;{finding.detective_finding}&quot;</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Judge Verdict</h4>
          <p className="text-sm text-slate-800">{finding.judge_verdict}</p>
        </div>
      </div>

      <div className="bg-rose-50 border-l-4 border-rose-500 p-4 mb-4 rounded-r-xl">
        <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Plain English Impact</h4>
        <p className="text-sm font-medium text-rose-900">{finding.plain_english_impact}</p>
      </div>

      {finding.recommendation === "NEGOTIATE" && (
        <div className="border border-indigo-100 rounded-xl overflow-hidden">
          <button 
            className="w-full bg-indigo-50 px-4 py-3 flex justify-between items-center hover:bg-indigo-100 transition-colors"
            onClick={() => setTipExpanded(!tipExpanded)}
          >
            <span className="text-sm font-bold text-indigo-700 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> Negotiation Tip</span>
            {tipExpanded ? <ChevronUp className="w-4 h-4 text-indigo-500" /> : <ChevronDown className="w-4 h-4 text-indigo-500" />}
          </button>
          {tipExpanded && (
            <div className="p-4 bg-white text-sm text-slate-700 border-t border-indigo-100">
              {finding.negotiation_tip}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
