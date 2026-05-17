"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";

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

      const res = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

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
    } catch (err: any) {
      setError(err.message || "Error reading file.");
    } finally {
      setIsParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400 bg-slate-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <Upload className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-700">Drag & drop your contract here</p>
            <p className="text-sm text-slate-500">Supports PDF, TXT, CSV, DOCX, and more</p>
          </div>
        </div>
      </div>

      {isParsing && (
        <div className="flex items-center justify-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg text-sm font-medium animate-pulse">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Extracting text from file...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="flex-1 h-px bg-slate-200"></div>
        <span className="text-sm font-medium text-slate-400">OR PASTE TEXT</span>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your contract text here..."
        className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y shadow-sm font-mono text-sm"
      />

      <button
        onClick={() => onAnalyze(text)}
        disabled={!text.trim() || isAnalyzing}
        className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all
                 disabled:opacity-50 disabled:cursor-not-allowed
                 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center space-x-2"
      >
        {isAnalyzing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{analysisStep || "Analyzing..."}</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>Analyze Contract</span>
          </>
        )}
      </button>
    </div>
  );
}
