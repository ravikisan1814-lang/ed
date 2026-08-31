"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ErrorBoundary from "./ErrorBoundary";
import type { ContentListItem } from "@/lib/types";

const FALLBACK_ITEMS: ContentListItem[] = [
  {
    id: "demo-locked-1",
    category_id: "c1",
    category_slug: "class-11",
    category_name: "Class 11",
    is_locked: true,
    required_access_level: 2,
    title: null,
    description: null,
    masked_title: "Locked content (Member tier)",
    owner_contact: null,
    file_url: "https://storage.example.com/class-11/advanced-notes.pdf",
  },
  {
    id: "demo-locked-2",
    category_id: "c2",
    category_slug: "class-12",
    category_name: "Class 12",
    is_locked: true,
    required_access_level: 3,
    title: null,
    description: null,
    masked_title: "Locked content (Co-member tier)",
    owner_contact: null,
    file_url: "https://storage.example.com/class-12/board-papers.pdf",
  },
  {
    id: "demo-open-1",
    category_id: "c3",
    category_slug: "general-knowledge",
    category_name: "General Knowledge",
    is_locked: false,
    required_access_level: 4,
    title: "Free GK samples",
    description: "Open sample questions for everyone.",
    masked_title: null,
    owner_contact: null,
  },
  {
    id: "demo-open-2",
    category_id: "c4",
    category_slug: "loksewa-knowledge",
    category_name: "Loksewa Knowledge",
    is_locked: false,
    required_access_level: 4,
    title: "Loksewa basics",
    description: "Introductory material, publicly available.",
    masked_title: null,
    owner_contact: null,
  },
];

export default function ContentGrid() {
  const [items, setItems] = useState<ContentListItem[] | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/contents");
        if (!res.ok) throw new Error(`API responded with ${res.status}`);
        const json = (await res.json()) as { data?: ContentListItem[] };
        if (cancelled) return;
        setItems(json.data ?? []);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load content");
        setDemoMode(true);
        setItems(FALLBACK_ITEMS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const getLevelLabel = (level: number): string => {
    const labels: Record<number, string> = {
      1: "Owner",
      2: "Member",
      3: "Co-member",
      4: "Public",
    };
    return labels[level] ?? `Level ${level}`;
  };

  const maskUrl = (url: string | null | undefined): string => {
    if (!url) return "";
    if (url.length <= 20) return url;
    return `${url.slice(0, 10)}...${url.slice(-8)}`;
  };

  if (loading) {
    return (
      <div className="content-grid" role="status" aria-live="polite" aria-label="Loading content">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card-skeleton" aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (error && !demoMode) {
    return (
      <div role="alert" aria-live="assertive" className="demo-note">
        Failed to load content: {error}
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div role="alert" aria-live="assertive" className="demo-note">
          Something went wrong loading content. Please try refreshing the page.
        </div>
      }
    >
      <div role="list" aria-label="Content library">
        {items === null || items.length === 0 ? (
          <p className="demo-note" role="status">No content available.</p>
        ) : (
          <div className="content-grid">
            {items.map((item) => (
              <article
                key={item.id}
                className={`card ${item.is_locked ? "card-locked" : ""}`}
                role="listitem"
                aria-label={`${item.title ?? item.masked_title ?? "Untitled"} - ${item.is_locked ? "Locked" : "Open"} content`}
              >
                <div className="card-meta">
                  <span className="card-category">
                    {item.category_name ?? item.category_slug ?? "Uncategorized"}
                  </span>
                  <span className={`badge ${item.is_locked ? "badge-locked" : "badge-open"}`}>
                    {item.is_locked ? getLevelLabel(item.required_access_level) : "Open"}
                  </span>
                </div>

                <h3 className="card-title">
                  {item.is_locked ? (
                    <span aria-label={`Locked: ${item.masked_title ?? "Content"}`}>
                      {item.masked_title ?? "Locked content"}
                    </span>
                  ) : (
                    item.title ?? "Untitled"
                  )}
                </h3>

                {item.description && (
                  <p className="card-description">{item.description}</p>
                )}

                {item.is_locked && item.owner_contact && (
                  <p className="locked-overlay-mail">
                    Contact:{" "}
                    <a href={`mailto:${item.owner_contact}`} aria-label={`Contact owner at ${item.owner_contact}`}>
                      {item.owner_contact}
                    </a>
                  </p>
                )}

                {!item.is_locked && item.file_url && (
                  <code className="card-file-url-masked" aria-label="File URL">
                    {maskUrl(item.file_url)}
                  </code>
                )}

                <div className="card-actions">
                  {item.is_locked ? (
                    <Link
                      href="/info"
                      className="btn btn-secondary"
                      aria-label={`Learn how to access ${item.title ?? "this content"}`}
                    >
                      Learn more
                    </Link>
                  ) : (
                    <Link
                      href={`/learn/${item.category_slug}/${item.id}`}
                      className="btn btn-primary"
                      aria-label={`View ${item.title ?? "this content"}`}
                    >
                      View
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {demoMode && (
          <p className="demo-note" role="status">
            Showing demo data — the contents API is not reachable right now.
          </p>
        )}
      </div>
    </ErrorBoundary>
  );
}
