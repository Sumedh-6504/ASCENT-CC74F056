"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ContractUpload from "../components/ContractUpload";
import { ShieldAlert, AlertTriangle } from "lucide-react";

export default function Home() {
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
        // Surface quota errors with a helpful hint
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
      sessionStorage.setItem("lexguard_results", JSON.stringify(data));
      router.push("/results");
    } catch {
      setError("Could not reach the analysis server. Make sure the backend is running.");
      setIsAnalyzing(false);
      setAnalysisStep(null);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #02091a 0%, #040e22 55%, #020c1e 100%)" }}
    >
      {/* Background blobs */}
      <div className="absolute top-[-8%] left-[-8%] w-[38%] h-[38%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,100,200,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute bottom-[-8%] right-[-8%] w-[35%] h-[35%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(255,45,85,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="max-w-2xl w-full space-y-4 relative z-10">

        {/* ── Compact header ── */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", boxShadow: "0 0 20px rgba(0,212,255,0.2)" }}
            >
              <ShieldAlert className="w-6 h-6" style={{ color: "#00d4ff" }} />
            </div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: "#e8f4ff" }}>
              LexGuard
            </h1>
          </div>
          <p
            className="text-xs font-semibold tracking-[0.22em] uppercase"
            style={{ color: "#5aaac8", fontFamily: "var(--font-mono, monospace)" }}
          >
            Contract Intelligence · Detect Hidden Traps Before You Sign
          </p>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: "rgba(255,45,85,0.1)", border: "1px solid rgba(255,45,85,0.35)", color: "#ff6080" }}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#ff2d55" }} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Upload card ── */}
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
            style={{ background: "linear-gradient(to bottom, rgba(0,212,255,0.04), transparent)" }}
          />
          <div className="relative z-10">
            <ContractUpload
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              analysisStep={analysisStep}
            />
          </div>
        </div>

        {/* ── Footer hint ── */}
        <p
          className="text-center text-[10px] tracking-[0.15em]"
          style={{ color: "#2a4560", fontFamily: "var(--font-mono, monospace)" }}
        >
          Powered by two adversarial Gemini agents · Detective + Judge
        </p>

      </div>
    </main>
  );
}
