/**
 * Landing Page — Public marketing page for LexGuard.
 *
 * Features:
 *   - Hero section with animated tagline
 *   - "Try Demo" button (limited analysis without auth)
 *   - "How it works" 3-step visual flow
 *   - Feature highlights (Detective, Judge, Simulator agents)
 *   - CTA to sign in
 */

"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Upload,
  Search,
  Scale,
  Zap,
  ArrowRight,
  Shield,
  Eye,
  Sparkles,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

const STEPS = [
  {
    icon: Upload,
    title: "Upload Contract",
    description: "Drag & drop your PDF, DOCX, or paste text directly. We support all standard contract formats.",
    color: "#00d4ff",
  },
  {
    icon: Search,
    title: "AI Analyzes",
    description: "Two adversarial Gemini agents — Detective and Judge — scan every clause for hidden traps.",
    color: "#ff6b35",
  },
  {
    icon: Scale,
    title: "Get Report",
    description: "Receive a detailed risk report with severity scores, plain-English explanations, and negotiation tips.",
    color: "#30d158",
  },
] as const;

const FEATURES = [
  {
    icon: Eye,
    title: "Detective Agent",
    description: "Scans contracts for 14+ categories of risk including auto-renewal traps, IP grabs, and hidden fees.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Shield,
    title: "Judge Agent",
    description: "Cross-validates findings, removes false positives, and provides actionable negotiation tips.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Zap,
    title: "Simulator Agent",
    description: "Generates worst-case scenarios showing the real financial and time impact of signing as-is.",
    gradient: "from-orange-500/20 to-red-500/20",
  },
] as const;

export default function LandingPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #02091a 0%, #040e22 55%, #020c1e 100%)",
      }}
    >
      {/* ── Background blobs ── */}
      <div
        className="absolute top-[-8%] left-[-8%] w-[38%] h-[38%] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,100,200,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-[20%] right-[-8%] w-[35%] h-[35%] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255,45,85,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-[50%] left-[40%] w-[25%] h-[25%] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Navigation ── */}
      <nav
        className="sticky top-0 z-20"
        style={{
          background: "rgba(2,9,26,0.6)",
          borderBottom: "1px solid rgba(0,212,255,0.08)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="p-1.5 rounded-lg"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
            >
              <ShieldAlert className="w-4 h-4" style={{ color: "#00d4ff" }} />
            </div>
            <span
              className="font-black text-base tracking-[0.12em]"
              style={{ color: "#c8d8e8" }}
            >
              LexGuard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.SIGN_IN}
              className="px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 hover:scale-105"
              style={{
                color: "#00d4ff",
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.25)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 animate-fade-up"
          style={{
            background: "rgba(0,212,255,0.06)",
            border: "1px solid rgba(0,212,255,0.2)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#00d4ff" }} />
          <span
            className="text-[11px] font-bold tracking-[0.2em] uppercase"
            style={{ color: "#00d4ff", fontFamily: "var(--font-mono, monospace)" }}
          >
            Powered by Adversarial AI
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6 animate-fade-up"
          style={{ color: "#e8f4ff", animationDelay: "80ms" }}
        >
          Detect Hidden Traps
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #00d4ff, #0088cc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Before You Sign
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
          style={{ color: "#7aaccf", animationDelay: "160ms" }}
        >
          Two adversarial AI agents scan your contracts for auto-renewal traps, IP grabs,
          liability caps, and 14+ risk categories — then explain every finding in plain English.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <Link
            href={ROUTES.SIGN_IN}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, rgb(0,180,230) 0%, rgb(0,100,210) 100%)",
              border: "1px solid rgba(0,212,255,0.7)",
              color: "#ffffff",
              boxShadow: "0 0 28px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={`${ROUTES.SIGN_IN}?callbackUrl=/upload&demo=true`}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold tracking-[0.15em] uppercase transition-all duration-200 hover:scale-105"
            style={{
              color: "#a0d4f0",
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.25)",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            <Zap className="w-4 h-4" />
            Try Demo
          </Link>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <h2
          className="text-center text-xs font-bold tracking-[0.35em] uppercase mb-12"
          style={{ color: "#5aadce", fontFamily: "var(--font-mono, monospace)" }}
        >
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl p-6 text-center group animate-fade-up"
              style={{
                animationDelay: `${i * 100}ms`,
                background: "rgba(4,14,34,0.6)",
                border: "1px solid rgba(0,212,255,0.1)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Step number */}
              <span
                className="absolute top-4 left-4 text-[10px] font-black font-mono tracking-widest"
                style={{ color: step.color, opacity: 0.5 }}
              >
                0{i + 1}
              </span>

              <div
                className="inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${step.color}15`,
                  border: `1px solid ${step.color}30`,
                }}
              >
                <step.icon className="w-6 h-6" style={{ color: step.color }} />
              </div>

              <h3 className="text-lg font-bold mb-2" style={{ color: "#e0ecf4" }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#7aaccf" }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Agent Features ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <h2
          className="text-center text-xs font-bold tracking-[0.35em] uppercase mb-12"
          style={{ color: "#5aadce", fontFamily: "var(--font-mono, monospace)" }}
        >
          Three AI Agents. One Verdict.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="rounded-2xl p-6 group animate-fade-up hover:translate-y-[-4px] transition-all duration-300"
              style={{
                animationDelay: `${i * 100}ms`,
                background: "rgba(4,14,34,0.7)",
                border: "1px solid rgba(0,212,255,0.08)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="inline-flex p-3 rounded-xl mb-4"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.15)",
                }}
              >
                <feature.icon className="w-6 h-6" style={{ color: "#00d4ff" }} />
              </div>

              <h3 className="text-lg font-bold mb-2" style={{ color: "#e0ecf4" }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#7aaccf" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-8 text-center" style={{ borderTop: "1px solid rgba(0,212,255,0.06)" }}>
        <p
          className="text-[11px] tracking-[0.15em]"
          style={{ color: "#2a4560", fontFamily: "var(--font-mono, monospace)" }}
        >
          © 2026 LexGuard · Contract Intelligence · Built with Gemini + Vertex AI
        </p>
      </footer>
    </div>
  );
}
