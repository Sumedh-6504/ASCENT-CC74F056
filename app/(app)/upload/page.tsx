/**
 * Upload Page — Contract analysis entry point (authenticated).
 *
 * Migrated from the original root page.tsx. After a successful analysis,
 * saves the result to Supabase and redirects to /analysis/[id] instead
 * of using sessionStorage.
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ContractUpload from "@/components/ContractUpload";
import { AlertTriangle } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisStep("Detective scanning...");
    setError(null);

    try {
      const stepTimer = setTimeout(() => setAnalysisStep("Judge verifying..."), 4000);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText: text }),
      });

      clearTimeout(stepTimer);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const detail = body?.detail ?? body?.error ?? `Server error (${res.status})`;
        if (res.status === 429) {
          setError(`Rate limit: ${detail}`);
        } else {
          setError(detail);
        }
        setIsAnalyzing(false);
        setAnalysisStep(null);
        return;
      }

      const data = await res.json();

      // If the API returned an analysis ID (saved to Supabase), redirect to it.
      // Otherwise, fall back to sessionStorage for backwards compatibility.
      if (data.id) {
        router.push(`/analysis/${data.id}`);
      } else {
        sessionStorage.setItem("lexguard_results", JSON.stringify(data));
        router.push("/results");
      }
    } catch {
      setError("Could not reach the analysis server. Make sure the backend is running.");
      setIsAnalyzing(false);
      setAnalysisStep(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div
        className="absolute top-[-8%] left-[-8%] w-[38%] h-[38%] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,100,200,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-[-8%] right-[-8%] w-[35%] h-[35%] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255,45,85,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-2xl w-full space-y-4 relative z-10">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "#e8f4ff" }}>
            Analyze a Contract
          </h1>
          <p
            className="text-xs font-semibold tracking-[0.22em] uppercase"
            style={{ color: "#5aaac8", fontFamily: "var(--font-mono, monospace)" }}
          >
            Upload or paste your contract text below
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(255,45,85,0.1)",
              border: "1px solid rgba(255,45,85,0.35)",
              color: "#ff6080",
            }}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#ff2d55" }} />
            <span>{error}</span>
          </div>
        )}

        {/* Upload card */}
        <div
          className="rounded-2xl p-5 relative group"
          style={{
            background: "rgba(4,14,34,0.7)",
            border: "1px solid rgba(0,212,255,0.15)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(0,212,255,0.04), transparent)",
            }}
          />
          <div className="relative z-10">
            <ContractUpload
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              analysisStep={analysisStep}
            />
          </div>
        </div>

        {/* Footer hint */}
        <p
          className="text-center text-[10px] tracking-[0.15em]"
          style={{ color: "#2a4560", fontFamily: "var(--font-mono, monospace)" }}
        >
          Powered by two adversarial Gemini agents · Detective + Judge
        </p>
      </div>
    </div>
  );
}
