/**
 * Navbar — Top navigation bar for the authenticated app layout.
 *
 * Features:
 *   - LexGuard logo with shield icon
 *   - Navigation links: Upload, Dashboard
 *   - Active link indicator (cyan underline)
 *   - UserMenu component on the right
 *
 * Uses glassmorphism styling consistent with the rest of the UI.
 */

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, Upload, LayoutDashboard } from "lucide-react";
import UserMenu from "./UserMenu";
import { ROUTES } from "@/lib/constants";

interface NavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const NAV_LINKS = [
  { href: ROUTES.UPLOAD,    label: "Upload",    icon: Upload },
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
] as const;

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: "rgba(2,9,26,0.75)",
        borderBottom: "1px solid rgba(0,212,255,0.1)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* ── Left: Logo + Nav Links ── */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 group">
            <div
              className="p-1.5 rounded-lg transition-all duration-300 group-hover:scale-105"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
            >
              <ShieldAlert className="w-4 h-4" style={{ color: "#00d4ff" }} />
            </div>
            <span className="font-black text-base tracking-[0.12em]" style={{ color: "#c8d8e8" }}>
              LexGuard
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 relative"
                  style={{
                    color: isActive ? "#00d4ff" : "#6a9ab8",
                    background: isActive ? "rgba(0,212,255,0.08)" : "transparent",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className="absolute bottom-[-9px] left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                      style={{ background: "#00d4ff", boxShadow: "0 0 8px rgba(0,212,255,0.5)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Right: User Menu ── */}
        <UserMenu user={user} />
      </div>
    </header>
  );
}
