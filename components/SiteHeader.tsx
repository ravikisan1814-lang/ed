"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACCESS_LEVEL_LABELS } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";
import GlobalSearch from "./GlobalSearch";

const OWNER_EMAIL = "ravikisan1814@gmail.com";

interface SessionUser {
  id: string;
  email: string;
  access_level: number;
  status: string | null;
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function SiteHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    async function refresh() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser?.email) {
        setUser(null);
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("access_level, status")
        .eq("id", authUser.id)
        .maybeSingle();
      setUser({
        id: authUser.id,
        email: authUser.email,
        access_level: profile?.access_level ?? 4,
        status: profile?.status ?? null,
      });
      setLoading(false);
    }
    void refresh();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    setProfileOpen(false);
    setMenuOpen(false);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } finally {
      setUser(null);
      router.refresh();
    }
  }

  const approved = user !== null && user.status === "approved";
  const pending = user !== null && user.status === "pending";
  const isOwner = approved && user.access_level === 1;
  const initials = user ? (user.email[0] ?? "?").toUpperCase() : "?";

  return (
    <header className="site-header">
      <Link href="/" className="brand brand-ravikisan">
        Ravikisan&apos;s Platform
      </Link>

      <GlobalSearch />

      <nav
        id="site-nav"
        aria-label="Primary"
        className={`site-nav${menuOpen ? " site-nav-open" : ""}`}
      >
        <Link href="/" className="nav-link" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/chat" className="nav-link" onClick={() => setMenuOpen(false)}>
          Chat
        </Link>
        <Link href="/info" className="nav-link" onClick={() => setMenuOpen(false)}>
          Rules &amp; Notices
        </Link>
        <Link href="/graphs" className="nav-link" onClick={() => setMenuOpen(false)}>
          Graphs
        </Link>
        <Link href="/technical-terms" className="nav-link" onClick={() => setMenuOpen(false)}>
          Technical Terms
        </Link>
        <Link href="/lab" className="nav-link" onClick={() => setMenuOpen(false)}>
          Lab
        </Link>
        {isOwner && (
          <Link href="/admin" className="nav-link nav-link-admin" onClick={() => setMenuOpen(false)}>
            Admin
          </Link>
        )}
      </nav>

      <div className="header-actions">
        <ThemeToggle />
        {isOwner ? null : loading ? null : approved ? (
          <div className="profile-menu" ref={profileRef}>
            <button
              type="button"
              className="profile-trigger"
              aria-label="Profile menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((v) => !v)}
            >
              <span className="avatar" aria-hidden="true">
                {initials}
              </span>
              <ChevronDownIcon />
            </button>
            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-head">
                  <span className="profile-email">{user.email}</span>
                  <span className="profile-tier">
                    {ACCESS_LEVEL_LABELS[(user.access_level as 1 | 2 | 3 | 4) ?? 4]}
                  </span>
                </div>
                {isOwner && (
                  <Link href="/admin" onClick={() => setProfileOpen(false)}>
                    Owner dashboard
                  </Link>
                )}
                <Link href="/info" onClick={() => setProfileOpen(false)}>
                  Rules &amp; Notices
                </Link>
                <button type="button" className="profile-logout" onClick={() => void handleSignOut()}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : pending ? (
          <Link href="/profile" className="btn-signin" onClick={() => setMenuOpen(false)} title="View your profile">
            Profile
          </Link>
        ) : (
          <Link href="/login" className="btn-signin" onClick={() => setMenuOpen(false)}>
            Sign in
          </Link>
        )}
        <button
          type="button"
          className="hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>
    </header>
  );
}
