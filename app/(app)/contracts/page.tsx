"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Search,
  Eye,
  Trash2,
  FileText,
  ShieldAlert,
  Upload,
  ArrowUpDown,
  LayoutGrid,
  List,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

interface ContractItem {
  id: string;
  document_name: string;
  document_type: string | null;
  overall_risk_score: number;
  risk_level: string;
  summary_stats: Record<string, number>;
  created_at: string;
}

type SortKey = "date" | "risk" | "name";
type ViewMode = "grid" | "list";

const RISK_COLORS: Record<string, string> = {
  CRITICAL: "bg-[#ff8a80]",
  HIGH: "bg-[#ff8a80]/80",
  MEDIUM: "bg-[#ffe082]",
  LOW: "bg-[#a7ffeb]",
  SAFE: "bg-[#a7ffeb]",
};

const RISK_ORDER: Record<string, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
  SAFE: 0,
};

export default function ContractsPage() {
  const { data: session } = useSession();
  const [contracts, setContracts] = useState<ContractItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    async function fetchContracts() {
      try {
        const res = await fetch("/api/analyses");
        if (res.ok) {
          const data = await res.json();
          setContracts(data.analyses ?? []);
        }
      } catch {
        console.error("Failed to fetch contracts");
      } finally {
        setIsLoading(false);
      }
    }
    if (session?.user) fetchContracts();
  }, [session]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this contract analysis? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContracts((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      console.error("Failed to delete");
    }
  }, []);

  const riskDistribution = useMemo(() => {
    const dist: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, SAFE: 0 };
    contracts.forEach((c) => {
      const level = c.risk_level || "SAFE";
      dist[level] = (dist[level] || 0) + 1;
    });
    return dist;
  }, [contracts]);

  const filtered = useMemo(() => {
    let result = [...contracts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.document_name.toLowerCase().includes(q));
    }

    if (activeFilter) {
      result = result.filter((c) => c.risk_level === activeFilter);
    }

    result.sort((a, b) => {
      if (sortKey === "date") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortKey === "risk") return (RISK_ORDER[b.risk_level] ?? 0) - (RISK_ORDER[a.risk_level] ?? 0);
      return a.document_name.localeCompare(b.document_name);
    });

    return result;
  }, [contracts, search, activeFilter, sortKey]);

  const totalFindings = useMemo(
    () => contracts.reduce((sum, c) => sum + (c.summary_stats?.total_findings || c.summary_stats?.total || 0), 0),
    [contracts]
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-[#1a1a1a]">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase font-sans text-[#1a1a1a]">
            Contracts
          </h1>
          <p className="text-xs font-mono tracking-wider text-[#555555] uppercase mt-1">
            All your analyzed documents in one place
          </p>
        </div>
        <Link
          href={ROUTES.UPLOAD}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff8a80] text-xs font-black tracking-wider uppercase rounded-none neo-btn text-[#1a1a1a] self-start"
        >
          <Upload className="w-4 h-4" />
          New Contract
        </Link>
      </div>

      {/* ── Risk Distribution Bar ── */}
      {contracts.length > 0 && (
        <div className="bg-[#ffffff] border-3 border-[#1a1a1a] neo-shadow overflow-hidden">
          <div className="bg-[#1a1a1a] px-6 py-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#ffffff]" />
            <span className="text-xs font-black tracking-wider uppercase text-[#ffffff] font-mono">
              Risk Distribution
            </span>
            <span className="ml-auto text-[10px] font-mono text-[#ffffff]/60 uppercase">
              {contracts.length} contracts &middot; {totalFindings} findings
            </span>
          </div>

          <div className="p-6">
            <div className="flex h-8 border-2 border-[#1a1a1a] overflow-hidden">
              {["CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"].map((level) => {
                const count = riskDistribution[level] || 0;
                if (count === 0) return null;
                const pct = (count / contracts.length) * 100;
                return (
                  <div
                    key={level}
                    className={`${RISK_COLORS[level]} flex items-center justify-center border-r border-[#1a1a1a]/20 last:border-r-0 transition-all`}
                    style={{ width: `${pct}%` }}
                    title={`${level}: ${count}`}
                  >
                    {pct > 10 && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#1a1a1a]">
                        {count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4 mt-3">
              {["CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"].map((level) => (
                <div key={level} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 border border-[#1a1a1a] ${RISK_COLORS[level]}`} />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {level} ({riskDistribution[level] || 0})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Controls Bar ── */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contracts..."
            className="w-full neo-input rounded-none text-xs placeholder:text-[#555555]"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#555555]" />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="text-[10px] font-black uppercase tracking-wider bg-[#ffffff] border-2 border-[#1a1a1a] px-2 py-1 cursor-pointer"
            >
              <option value="date">Date</option>
              <option value="risk">Risk Level</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex border-2 border-[#1a1a1a]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-all ${viewMode === "grid" ? "bg-[#d2c4fb]" : "bg-[#ffffff] hover:bg-[#f5f4f0]"}`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 border-l-2 border-[#1a1a1a] transition-all ${viewMode === "list" ? "bg-[#d2c4fb]" : "bg-[#ffffff] hover:bg-[#f5f4f0]"}`}
              title="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter Badges ── */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: null, label: "All", bg: "bg-[#ffe082]" },
          { key: "CRITICAL", label: "Critical", bg: "bg-[#ff8a80]" },
          { key: "HIGH", label: "High", bg: "bg-[#ff8a80]/80" },
          { key: "MEDIUM", label: "Medium", bg: "bg-[#ffe082]" },
          { key: "LOW", label: "Low", bg: "bg-[#a7ffeb]" },
          { key: "SAFE", label: "Safe", bg: "bg-[#a7ffeb]" },
        ].map(({ key, label, bg }) => (
          <button
            key={label}
            onClick={() => setActiveFilter(key)}
            className={`px-3 py-1 text-[10px] font-black uppercase border-2 border-[#1a1a1a] transition-all ${
              activeFilter === key
                ? `${bg} neo-shadow-sm translate-y-[-1px]`
                : "bg-[#ffffff] hover:translate-y-[-1px] active:translate-y-[1px]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-[#1a1a1a]/20 border-t-[#d2c4fb] rounded-full animate-spin" />
          <span className="text-xs font-mono font-black uppercase tracking-widest text-[#555555]">
            Loading contracts...
          </span>
        </div>
      )}

      {/* ── Empty ── */}
      {!isLoading && contracts.length === 0 && (
        <div className="bg-[#ffffff] border-3 border-[#1a1a1a] neo-shadow-lg flex flex-col items-center justify-center py-20 text-center px-6 space-y-4">
          <div className="p-4 border-2 border-[#1a1a1a] bg-[#ffe082] neo-shadow-sm">
            <ShieldAlert className="w-8 h-8 text-[#1a1a1a]" />
          </div>
          <p className="text-lg font-extrabold uppercase">No contracts yet</p>
          <p className="text-xs font-mono text-[#555555] uppercase max-w-sm">
            Upload your first contract to start detecting predatory clauses
          </p>
          <Link
            href={ROUTES.UPLOAD}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff8a80] text-xs font-black tracking-wider uppercase rounded-none neo-btn text-[#1a1a1a]"
          >
            <Upload className="w-4 h-4" />
            Upload Contract
          </Link>
        </div>
      )}

      {/* ── No Results ── */}
      {!isLoading && contracts.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <Search className="w-8 h-8 text-[#555555]" />
          <p className="text-xs font-mono font-black uppercase tracking-wider text-[#555555]">
            No contracts match your search
          </p>
        </div>
      )}

      {/* ── Grid View ── */}
      {!isLoading && filtered.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((contract) => {
            const date = new Date(contract.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            });
            const findings = contract.summary_stats?.total_findings || contract.summary_stats?.total || 0;
            const pillBg = RISK_COLORS[contract.risk_level] || "bg-[#a7ffeb]";

            return (
              <div
                key={contract.id}
                className="bg-[#ffffff] border-2 border-[#1a1a1a] neo-shadow flex flex-col justify-between group hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1a1a1a] transition-all"
              >
                {/* Card Header */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`inline-block px-2.5 py-0.5 border-2 border-[#1a1a1a] text-[9px] font-black uppercase tracking-wider ${pillBg}`}>
                      {contract.risk_level}
                    </span>
                    <span className="text-[10px] font-mono text-[#555555]">{date}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 border-2 border-[#1a1a1a] bg-[#f5f4f0] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#1a1a1a]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold uppercase tracking-tight truncate">
                        {contract.document_name}
                      </h3>
                      <p className="text-[10px] font-mono text-[#555555] uppercase mt-0.5">
                        {contract.document_type?.replace(/_/g, " ") || "Contract"}
                      </p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 pt-2 border-t border-[#1a1a1a]/10">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3 text-[#555555]" />
                      <span className="text-[10px] font-black uppercase">
                        {contract.overall_risk_score}/100
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-[#555555]" />
                      <span className="text-[10px] font-black uppercase">
                        {findings} {findings === 1 ? "finding" : "findings"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex border-t-2 border-[#1a1a1a]">
                  <Link
                    href={`/analysis/${contract.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-wider bg-[#d2c4fb] hover:bg-[#c4b5f0] transition-colors border-r border-[#1a1a1a]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(contract.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider bg-[#ffffff] hover:bg-[#ff8a80] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── List View ── */}
      {!isLoading && filtered.length > 0 && viewMode === "list" && (
        <div className="bg-[#ffffff] border-3 border-[#1a1a1a] neo-shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-left">
                  <th className="px-6 py-4 text-xs font-black font-mono tracking-widest uppercase text-[#ffffff]">
                    Contract
                  </th>
                  <th className="px-6 py-4 text-xs font-black font-mono tracking-widest uppercase text-[#ffffff]">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-black font-mono tracking-widest uppercase text-[#ffffff]">
                    Score
                  </th>
                  <th className="px-6 py-4 text-xs font-black font-mono tracking-widest uppercase text-[#ffffff]">
                    Risk
                  </th>
                  <th className="px-6 py-4 text-xs font-black font-mono tracking-widest uppercase text-[#ffffff]">
                    Findings
                  </th>
                  <th className="px-6 py-4 text-xs font-black font-mono tracking-widest uppercase text-[#ffffff] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/10">
                {filtered.map((contract) => {
                  const date = new Date(contract.created_at).toISOString().split("T")[0];
                  const findings = contract.summary_stats?.total_findings || contract.summary_stats?.total || 0;
                  const pillBg = RISK_COLORS[contract.risk_level] || "bg-[#a7ffeb]";

                  return (
                    <tr key={contract.id} className="hover:bg-[#f5f4f0]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 border-2 border-[#1a1a1a] bg-[#f5f4f0] flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-extrabold uppercase truncate max-w-[200px]">
                            {contract.document_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-[#555555]">{date}</td>
                      <td className="px-6 py-4 text-xs font-black">{contract.overall_risk_score}/100</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 border-2 border-[#1a1a1a] text-[10px] font-black uppercase tracking-wider ${pillBg}`}>
                          {contract.risk_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono">{findings}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <Link
                            href={`/analysis/${contract.id}`}
                            className="p-2 bg-[#ffffff] border-2 border-[#1a1a1a] neo-shadow-sm hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(contract.id)}
                            className="p-2 bg-[#ffffff] border-2 border-[#1a1a1a] neo-shadow-sm hover:translate-y-[-1px] hover:bg-[#ff8a80] active:translate-y-[1px] transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
