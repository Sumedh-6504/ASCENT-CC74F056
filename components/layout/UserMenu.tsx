/**
 * UserMenu — Avatar dropdown with sign-out action.
 *
 * Shows the user's avatar (from OAuth provider) or a fallback initial.
 * Click to toggle a dropdown with name, email, and sign-out button.
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full transition-all duration-200 hover:ring-2"
        style={{ outline: "2px solid transparent", outlineOffset: "2px" }}
        aria-label="User menu"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-8 h-8 rounded-full"
            style={{ border: "2px solid rgba(0,212,255,0.3)" }}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, rgba(0,180,230,0.3), rgba(0,100,210,0.3))",
              border: "2px solid rgba(0,212,255,0.3)",
              color: "#00d4ff",
            }}
          >
            {initials}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden animate-fade-up z-50"
          style={{
            background: "rgba(4,14,34,0.95)",
            border: "1px solid rgba(0,212,255,0.15)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* User info */}
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}>
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ background: "rgba(0,212,255,0.08)" }}
              >
                <User className="w-4 h-4" style={{ color: "#00d4ff" }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "#e0ecf4" }}>
                  {user.name || "User"}
                </p>
                <p className="text-xs truncate" style={{ color: "#5a8aaa", fontFamily: "var(--font-mono, monospace)" }}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 hover:brightness-125"
            style={{ color: "#ff6080" }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
