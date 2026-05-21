/**
 * Custom Sign-In Page
 *
 * Matches the LexGuard glassmorphism dark theme.
 * Supports three sign-in methods:
 *   1. Google OAuth
 *   2. GitHub OAuth
 *   3. Email + Password (Credentials)
 *
 * The callbackUrl query parameter controls where the user is
 * redirected after successful authentication.
 */

"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

/** SVG icons for OAuth providers (no external dependency). */
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

/** Wrapper that provides Suspense boundary for useSearchParams(). */
export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const signupEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(signupEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /** Handle email/password sign-in via Credentials provider. */
  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /** Handle OAuth provider sign-in. */
  const handleOAuth = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl });
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
            Sign in to access your contract intelligence dashboard
          </p>
        </div>

        {/* ── Sign-in Card ── */}
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{
            background: "rgba(4,14,34,0.7)",
            border: "1px solid rgba(0,212,255,0.15)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleOAuth("google")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#e0ecf4",
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuth("github")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#e0ecf4",
              }}
            >
              <GitHubIcon />
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(0,212,255,0.15), transparent)" }} />
            <span className="text-[10px] font-bold font-mono tracking-[0.25em] uppercase" style={{ color: "#5a8aaa" }}>
              or use email
            </span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(0,212,255,0.15), transparent)" }} />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentials} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5a8aaa" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
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

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#5a8aaa" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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

            <button
              type="submit"
              disabled={isLoading}
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
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Redirect */}
          <div className="flex items-center gap-2 justify-center text-xs" style={{ color: "#5a8aaa" }}>
            <span>New to LexGuard?</span>
            <a
              href="/auth/signup"
              className="font-bold hover:underline transition-all duration-200"
              style={{ color: "#00d4ff" }}
            >
              Create an Account
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
