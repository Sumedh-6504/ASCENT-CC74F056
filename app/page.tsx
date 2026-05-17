"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ContractUpload from "../components/ContractUpload";
import { ShieldAlert } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisStep("Detective scanning...");

    try {
      // We simulate the step change halfway through, or let the API handle it.
      // Since it's a single API call, we'll just fake the transition for UX after a few seconds.
      const stepTimer = setTimeout(() => {
        setAnalysisStep("Judge verifying...");
      }, 4000);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText: text }),
      });

      clearTimeout(stepTimer);

      if (!res.ok) {
        throw new Error("Analysis failed");
      }

      const data = await res.json();
      
      // Pass data to results page via sessionStorage or state management.
      // For this boilerplate, sessionStorage is easiest.
      sessionStorage.setItem("lexguard_results", JSON.stringify(data));
      
      router.push("/results");
    } catch (error) {
      console.error(error);
      alert("Failed to analyze contract. Check console for details.");
      setIsAnalyzing(false);
      setAnalysisStep(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <ShieldAlert className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-black text-slate-800 tracking-tight">LexGuard</h1>
          </div>
          <h2 className="text-2xl font-bold text-slate-700">Contract Intelligence Analyzer</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Upload your contract. Our adversarial AI system will scan for hidden traps (Detective) 
            and evaluate the severity and negotiation strategy (Judge).
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <ContractUpload 
            onAnalyze={handleAnalyze} 
            isAnalyzing={isAnalyzing} 
            analysisStep={analysisStep} 
          />
        </div>
      </div>
    </main>
  );
}
