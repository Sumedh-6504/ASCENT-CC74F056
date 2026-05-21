/**
 * Custom Sign-Up Page
 *
 * Matches the LexGuard premium glassmorphism dark theme.
 * Lets users create custom email/password accounts stored in Supabase.
 */

"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Form validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account. Please try again.");
      } else {
        setSuccess("Account created successfully! Redirecting to sign in...");
        // Redirect to sign in page after 2 seconds
        setTimeout(() => {
          router.push(`/auth/signin?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } catch {
      setError("Something went wrong. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #02091a 0%, #040e22 55%, #020c1e 100%)" }}
    >
      {/* Background blobs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,100,200,0.15) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,212,255,0.1) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="w-full max-w-md relative z-10 space-y-6">

        {/* ── Logo + Heading ── */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div
              className="p-2.5 rounded-xl"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", boxShadow: "0 0 20px rgba(0,212,255,0.2)" }}
            >
              <ShieldAlert className="w-7 h-7" style={{ color: "#00d4ff" }} />
            </div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: "#e8f4ff" }}>
              LexGuard
            </h1>
          </div>
          <p className="text-sm" style={{ color: "#6a9ab8" }}>
            Create an account to start analyzing your contracts
          </p>
        </div>

        {/* ── Sign-up Card ── */}
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{
            background: "rgba(4,14,34,0.7)",
            border: "1px solid rgba(0,212,255,0.15)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* Success Banner */}
          {success && (
            <div
              className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-300"
              style={{ background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.35)", color: "#2ecc71" }}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5a8aaa" }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: "rgba(2,9,26,0.8)",
                  border: "1px solid rgba(0,212,255,0.12)",
                  color: "#b0cce0",
                  caretColor: "#00d4ff",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.12)"; }}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5a8aaa" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: "rgba(2,9,26,0.8)",
                  border: "1px solid rgba(0,212,255,0.12)",
                  color: "#b0cce0",
                  caretColor: "#00d4ff",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.12)"; }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5a8aaa" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: "rgba(2,9,26,0.8)",
                  border: "1px solid rgba(0,212,255,0.12)",
                  color: "#b0cce0",
                  caretColor: "#00d4ff",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.12)"; }}
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5a8aaa" }} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: "rgba(2,9,26,0.8)",
                  border: "1px solid rgba(0,212,255,0.12)",
                  color: "#b0cce0",
                  caretColor: "#00d4ff",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.12)"; }}
              />
            </div>

            {/* Error Banner */}
            {error && (
              <div
                className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs font-medium"
                style={{ background: "rgba(255,45,85,0.1)", border: "1px solid rgba(255,45,85,0.3)", color: "#ff6080" }}
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full py-3 rounded-xl text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, rgb(0,180,230) 0%, rgb(0,100,210) 100%)",
                border: "1px solid rgba(0,212,255,0.7)",
                color: "#ffffff",
                boxShadow: "0 0 28px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already have an account? */}
          <div className="flex items-center gap-2 justify-center text-xs" style={{ color: "#5a8aaa" }}>
            <span>Already have an account?</span>
            <a
              href="/auth/signin"
              className="font-bold hover:underline transition-all duration-200"
              style={{ color: "#00d4ff" }}
            >
              Sign In
            </a>
          </div>
        </div>

        {/* Back to home */}
        <p className="text-center">
          <a
            href="/"
            className="text-xs font-medium transition-colors duration-200 hover:underline"
            style={{ color: "#5a8aaa" }}
          >
            ← Back to home
          </a>
        </p>
      </div>
    </main>
  );
}
