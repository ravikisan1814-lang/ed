"use client";

import { useState, useEffect } from "react";
import BackButton from "@/components/BackButton";
import SyllabusAnalytics from "@/components/visuals/SyllabusAnalytics";
import type { ExamGroupNode } from "@/lib/types";

export default function SyllabusGraphsPage() {
  const [tree, setTree] = useState<ExamGroupNode[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/hierarchy");
        const json = await res.json();
        if (!cancelled) setTree(json.data ?? null);
      } catch {
        if (!cancelled) setTree(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <BackButton href="/graphs" />
      <section className="hero hero-premium">
        <span className="hero-badge">Analytics</span>
        <h1>Syllabus Analytics</h1>
        <p>Interactive charts showing syllabus structure, content distribution, and access tiers.</p>
      </section>
      <section className="content-section">
        {loading ? (
          <div className="viz-loading">Loading analytics…</div>
        ) : (
          <SyllabusAnalytics tree={tree} />
        )}
      </section>
    </>
  );
}
