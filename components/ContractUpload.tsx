"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, AlertCircle, Scan } from "lucide-react";

interface ContractUploadProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
  analysisStep: string | null;
}

export default function ContractUpload({ onAnalyze, isAnalyzing, analysisStep }: ContractUploadProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setError(null);
    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse", { method: "POST", body: formData });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to parse file");
      }

      const data = await res.json();
      if (data.text) {
        setText(data.text);
      } else {
        setError("Could not extract text from this file.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error reading file.");
    } finally {
      setIsParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

  return (
    <div className="w-full space-y-3">

      {/* ── Dropzone ── */}
      <div
        {...getRootProps()}
        className="relative rounded-xl p-4 text-center cursor-pointer transition-all duration-300 overflow-hidden select-none"
        style={{
          background: isDragActive ? "rgba(0,212,255,0.06)" : "rgba(2,9,26,0.6)",
          border: `1px solid ${isDragActive ? "rgba(0,212,255,0.6)" : "rgba(0,212,255,0.15)"}`,
          boxShadow: isDragActive ? "0 0 30px rgba(0,212,255,0.15), inset 0 0 30px rgba(0,212,255,0.03)" : "none",
        }}
      >
        <input {...getInputProps()} />

        {/* Corner brackets */}
        {(["top-left","top-right","bottom-left","bottom-right"] as const).map((pos) => (
          <div
            key={pos}
            className="absolute w-4 h-4 transition-all duration-300"
            style={{
              top:    pos.startsWith("top")    ? 8 : undefined,
              bottom: pos.startsWith("bottom") ? 8 : undefined,
              left:   pos.endsWith("left")     ? 8 : undefined,
              right:  pos.endsWith("right")    ? 8 : undefined,
              borderTop:    pos.startsWith("top")    ? `1.5px solid ${isDragActive ? "rgba(0,212,255,.7)" : "rgba(0,212,255,.25)"}` : undefined,
              borderBottom: pos.startsWith("bottom") ? `1.5px solid ${isDragActive ? "rgba(0,212,255,.7)" : "rgba(0,212,255,.25)"}` : undefined,
              borderLeft:   pos.endsWith("left")     ? `1.5px solid ${isDragActive ? "rgba(0,212,255,.7)" : "rgba(0,212,255,.25)"}` : undefined,
              borderRight:  pos.endsWith("right")    ? `1.5px solid ${isDragActive ? "rgba(0,212,255,.7)" : "rgba(0,212,255,.25)"}` : undefined,
            }}
          />
        ))}

        {isDragActive && (
          <div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent pointer-events-none"
            style={{ animation: "sweep 1.2s linear infinite" }}
          />
        )}

        {/* Horizontal layout for compact feel */}
        <div className="flex items-center justify-center gap-3 relative z-10">
          <div
            className="p-2.5 rounded-xl flex-shrink-0 transition-all duration-300"
            style={{
              background: isDragActive ? "rgba(0,212,255,0.15)" : "rgba(15,30,60,0.7)",
              border: `1px solid ${isDragActive ? "rgba(0,212,255,0.5)" : "rgba(100,130,180,0.2)"}`,
              boxShadow: isDragActive ? "0 0 16px rgba(0,212,255,0.25)" : "none",
            }}
          >
            <Upload className="w-5 h-5 transition-colors duration-300" style={{ color: isDragActive ? "#00d4ff" : "#6a9ab8" }} />
          </div>
          <div className="text-left">
            <p
              className="text-sm font-semibold tracking-[0.1em] transition-colors duration-300"
              style={{ color: isDragActive ? "#00d4ff" : "#a0c4e0" }}
            >
              {isDragActive ? "Drop to scan" : "Drag & drop your contract"}
            </p>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: "#6a9ab8" }}>
              PDF · DOCX · TXT · MD
            </p>
          </div>
        </div>
      </div>

      {/* ── Status messages ── */}
      {isParsing && (
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-mono tracking-wider"
          style={{ background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff" }}
        >
          <div className="w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin flex-shrink-0" />
          <span>Extracting text...</span>
        </div>
      )}

      {error && (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono"
          style={{ background: "rgba(255,45,85,0.08)", border: "1px solid rgba(255,45,85,0.25)", color: "#ff2d55" }}
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(0,212,255,0.15), transparent)" }} />
        <span className="text-[10px] font-bold font-mono tracking-[0.25em]" style={{ color: "#6a9ab8" }}>OR PASTE TEXT</span>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(0,212,255,0.15), transparent)" }} />
      </div>

      {/* ── Textarea ── */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="// paste contract text here..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl resize-none text-sm leading-relaxed transition-all duration-200 focus:outline-none"
          style={{
            background: "rgba(2,9,26,0.8)",
            border: "1px solid rgba(0,212,255,0.12)",
            color: "#b0cce0",
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            caretColor: "#00d4ff",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid rgba(0,212,255,0.4)";
            e.currentTarget.style.boxShadow = "0 0 16px rgba(0,212,255,0.08)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid rgba(0,212,255,0.12)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {text && (
          <div
            className="absolute bottom-2.5 right-3 text-[10px] font-mono"
            style={{ color: "#5a8aaa" }}
          >
            {text.length.toLocaleString()} chars
          </div>
        )}
      </div>

      {/* ── Analyze Button ── */}
      <button
        onClick={() => onAnalyze(text)}
        disabled={!text.trim() || isAnalyzing}
        className="w-full py-3 rounded-xl text-sm font-bold tracking-[0.18em] uppercase transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-35 disabled:cursor-not-allowed relative overflow-hidden group"
        style={{
          background: !text.trim() || isAnalyzing
            ? "rgba(10,28,58,0.7)"
            : "linear-gradient(135deg, rgb(0,180,230) 0%, rgb(0,100,210) 100%)",
          border: `1px solid ${text.trim() && !isAnalyzing ? "rgba(0,212,255,0.7)" : "rgba(0,212,255,0.2)"}`,
          color: "#ffffff",
          boxShadow: text.trim() && !isAnalyzing
            ? "0 0 28px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.12)"
            : "none",
          fontFamily: "var(--font-mono, monospace)",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05), transparent)" }}
        />
        {isAnalyzing ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{analysisStep || "Analyzing..."}</span>
          </>
        ) : (
          <>
            <Scan className="w-4 h-4" />
            <span>Initiate Analysis</span>
          </>
        )}
      </button>

    </div>
  );
}
