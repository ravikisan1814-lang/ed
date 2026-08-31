"use client";

import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface LearnShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function LearnShell({ children, title, description }: LearnShellProps) {
  return (
    <div className="learn-shell">
      {/* Hero */}
      <div className="learn-hero">
        <div className="learn-hero-bg">
          <ThreeScene figureType="abstract" topicTitle="Learning" />
        </div>
        <div className="learn-hero-overlay" />
        <div className="learn-hero-content">
          <div className="learn-hero-badge">📚 NEB Curriculum</div>
          <h1 className="learn-hero-title">
            {title || "Learning"} <span className="gradient-text">Materials</span>
          </h1>
          <p className="learn-hero-desc">
            {description || "Browse and study NEB Class 11 & 12 content organized by exam group, subject, chapter, and topic."}
          </p>
        </div>
      </div>

      {/* Learn stats */}
      <div className="learn-stats">
        <div className="learn-stat">
          <span className="learn-stat-value">6</span>
          <span className="learn-stat-label">Subjects</span>
        </div>
        <div className="learn-stat">
          <span className="learn-stat-value">85+</span>
          <span className="learn-stat-label">Chapters</span>
        </div>
        <div className="learn-stat">
          <span className="learn-stat-value">314+</span>
          <span className="learn-stat-label">Topics</span>
        </div>
        <div className="learn-stat">
          <span className="learn-stat-value">Tiered</span>
          <span className="learn-stat-label">Access</span>
        </div>
      </div>

      {/* Main content */}
      <div className="learn-content">
        {children}
      </div>
    </div>
  );
}
