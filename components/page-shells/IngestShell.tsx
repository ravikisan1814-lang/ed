"use client";

import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface IngestShellProps {
  children: React.ReactNode;
}

export default function IngestShell({ children }: IngestShellProps) {
  return (
    <div className="ingest-shell">
      {/* Hero */}
      <div className="ingest-hero">
        <div className="ingest-hero-bg">
          <ThreeScene figureType="molecular" topicTitle="Content Ingest" />
        </div>
        <div className="ingest-hero-overlay" />
        <div className="ingest-hero-content">
          <div className="ingest-hero-badge">📤 Content Management</div>
          <h1 className="ingest-hero-title">
            Content <span className="gradient-text">Ingest</span>
          </h1>
          <p className="ingest-hero-desc">
            Upload and manage educational content. Paste notes, auto-classify topics,
            and assign access levels for the syllabus hierarchy.
          </p>
        </div>
      </div>

      {/* Ingest stats */}
      <div className="ingest-stats">
        <div className="ingest-stat">
          <span className="ingest-stat-value">Auto-Classify</span>
          <span className="ingest-stat-label">AI-powered topic detection</span>
        </div>
        <div className="ingest-stat">
          <span className="ingest-stat-value">Multi-Format</span>
          <span className="ingest-stat-label">Support various content types</span>
        </div>
        <div className="ingest-stat">
          <span className="ingest-stat-value">RLS Protected</span>
          <span className="ingest-stat-label">Owner-only access</span>
        </div>
      </div>

      {/* Main content */}
      <div className="ingest-content">
        {children}
      </div>
    </div>
  );
}
