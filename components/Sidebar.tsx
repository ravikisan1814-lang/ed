"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ACCESS_LEVEL_LABELS } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";

const OWNER_EMAIL = "ravikisan1814@gmail.com";
const UPGRADE_MAILTO = `mailto:${OWNER_EMAIL}?subject=Upgrade%20to%20Premium`;

interface SessionUser {
  id: string;
  email: string;
  access_level: number;
  status: string | null;
}

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

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

  async function handleSignOut() {
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

  function close() {
    setOpen(false);
  }

  return (
    <>
      <aside className={`sidebar${open ? " sidebar--open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <Link href="/" className="brand brand-ravikisan" onClick={close}>
            Ravikisan&apos;s Platform
          </Link>
        </div>

        <nav className="sidebar-nav">
          <Link href="/" className="sidebar-link" onClick={close}>
            Home
          </Link>
          <Link href="/chat" className="sidebar-link" onClick={close}>
            Chat
          </Link>
          <Link href="/info" className="sidebar-link" onClick={close}>
            Rules &amp; Notices
          </Link>
          <Link href="/graphs" className="sidebar-link" onClick={close}>
            Graphs
          </Link>

          {loading ? null : (
            <>
              {approved || pending ? (
                <>
                  <div className="sidebar-divider" />
                  <div className="sidebar-profile">
                    <span className="sidebar-avatar">{initials}</span>
                    <div className="sidebar-profile-info">
                      <span className="sidebar-email">{user.email}</span>
                      <span className="sidebar-tier">
                        {ACCESS_LEVEL_LABELS[(user.access_level as 1 | 2 | 3 | 4) ?? 4]}
                      </span>
                    </div>
                  </div>
                  {isOwner && (
                    <Link href="/admin" className="sidebar-link sidebar-link--owner" onClick={close}>
                      Admin
                    </Link>
                  )}
                  <a href={UPGRADE_MAILTO} className="sidebar-link" onClick={close}>
                    Upgrade to Premium
                  </a>
                  <button
                    type="button"
                    className="sidebar-link sidebar-link--logout"
                    onClick={() => void handleSignOut()}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/login" className="sidebar-link sidebar-link--primary" onClick={close}>
                  Sign in
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <ThemeToggle />
        </div>
      </aside>

      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
    </>
  );
}
