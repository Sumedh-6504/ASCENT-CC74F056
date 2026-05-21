/**
 * Dashboard Page — Analysis history with search, filter, and sort.
 *
 * Fetches all analyses for the current user from Supabase and
 * displays them in a responsive grid with:
 *   - Search by document name
 *   - Filter by risk level
 *   - Sort by date or risk score
 *   - Delete functionality
 *   - Empty state with CTA to upload first contract
 */

"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Upload, ShieldAlert, FileSearch } from "lucide-react";
import AnalysisCard from "@/components/dashboard/AnalysisCard";
import SearchFilter, { SortMode } from "@/components/dashboard/SearchFilter";
import { ROUTES, RISK_LEVELS } from "@/lib/constants";

interface AnalysisSummary {
  id: string;
  document_name: string;
  document_type: string | null;
  overall_risk_score: number;
  risk_level: string;
  summary_stats: Record<string, number>;
  created_at: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter / search state
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  /** Fetch analyses from the API. */
  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const res = await fetch("/api/analyses");
        if (res.ok) {
          const data = await res.json();
          setAnalyses(data.analyses ?? []);
        }
      } catch {
        console.error("Failed to fetch analyses");
      } finally {
        setIsLoading(false);
      }
    }
    if (session?.user) {
      fetchAnalyses();
    }
  }, [session]);

  /** Delete an analysis. */
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this analysis? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAnalyses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      console.error("Failed to delete analysis");
    }
  }, []);

  /** Apply search, filter, and sort. */
  const filteredAnalyses = useMemo(() => {
    let result = [...analyses];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) =>
        a.document_name.toLowerCase().includes(q)
      );
    }

    // Filter by risk level
    if (activeFilter) {
      result = result.filter((a) => a.risk_level === activeFilter);
    }

    // Sort
    if (sortMode === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      result.sort((a, b) => b.overall_risk_score - a.overall_risk_score);
    }

    return result;
  }, [analyses, search, activeFilter, sortMode]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "#e8f4ff" }}>
            Dashboard
          </h1>
          <p className="text-xs font-mono tracking-wider mt-1" style={{ color: "#5a8aaa" }}>
            {analyses.length} {analyses.length === 1 ? "analysis" : "analyses"} total
          </p>
        </div>

        <Link
          href={ROUTES.UPLOAD}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, rgb(0,180,230) 0%, rgb(0,100,210) 100%)",
            border: "1px solid rgba(0,212,255,0.7)",
            color: "#ffffff",
            boxShadow: "0 0 20px rgba(0,212,255,0.2)",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          <Upload className="w-3.5 h-3.5" />
          New Analysis
        </Link>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortMode={sortMode}
        onSortChange={setSortMode}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "rgba(0,212,255,0.3)", borderTopColor: "#00d4ff" }}
            />
            <span
              className="text-sm tracking-[0.2em] uppercase"
              style={{ color: "#00d4ff", fontFamily: "var(--font-mono, monospace)" }}
            >
              Loading...
            </span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && analyses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div
            className="p-4 rounded-2xl"
            style={{
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.15)",
            }}
          >
            <ShieldAlert className="w-10 h-10" style={{ color: "#5a8aaa" }} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg font-bold" style={{ color: "#c8d8e8" }}>
              No analyses yet
            </p>
            <p className="text-sm" style={{ color: "#5a8aaa" }}>
              Upload your first contract to get started
            </p>
          </div>
          <Link
            href={ROUTES.UPLOAD}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold tracking-wider transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgb(0,180,230) 0%, rgb(0,100,210) 100%)",
              border: "1px solid rgba(0,212,255,0.7)",
              color: "#ffffff",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            <Upload className="w-4 h-4" />
            Upload Contract
          </Link>
        </div>
      )}

      {/* No results after filter */}
      {!isLoading && analyses.length > 0 && filteredAnalyses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <FileSearch className="w-8 h-8" style={{ color: "#5a8aaa" }} />
          <p className="text-sm font-medium" style={{ color: "#6a9ab8" }}>
            No analyses match your search
          </p>
        </div>
      )}

      {/* Analysis grid */}
      {!isLoading && filteredAnalyses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAnalyses.map((analysis) => (
            <AnalysisCard
              key={analysis.id}
              analysis={analysis}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
