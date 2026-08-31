"use client";

import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface TechnicalTermsShellProps {
  children: React.ReactNode;
}

export default function TechnicalTermsShell({ children }: TechnicalTermsShellProps) {
  return (
    <div className="tech-terms-shell">
      {/* Hero with 3D background */}
      <div className="tech-terms-hero">
        <div className="tech-terms-hero-bg">
          <ThreeScene figureType="vectorfield" topicTitle="Technical Terms" />
        </div>
        <div className="tech-terms-hero-overlay" />
        <div className="tech-terms-hero-content">
          <div className="tech-terms-hero-badge">⚡ Physics & Chemistry</div>
          <h1 className="tech-terms-hero-title">
            Technical <span className="gradient-text">Terms</span>
          </h1>
          <p className="tech-terms-hero-desc">
            Master the fundamental concepts of physics and chemistry through interactive 3D models,
            visualizations, and detailed explanations of key terms and formulas.
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="tech-terms-stats">
        <div className="tech-terms-stat">
          <span className="tech-terms-stat-value">24+</span>
          <span className="tech-terms-stat-label">Core Concepts</span>
        </div>
        <div className="tech-terms-stat">
          <span className="tech-terms-stat-value">12</span>
          <span className="tech-terms-stat-label">3D Simulations</span>
        </div>
        <div className="tech-terms-stat">
          <span className="tech-terms-stat-value">50+</span>
          <span className="tech-terms-stat-label">Formulas</span>
        </div>
        <div className="tech-terms-stat">
          <span className="tech-terms-stat-value">8</span>
          <span className="tech-terms-stat-label">Topics</span>
        </div>
      </div>

      {/* Main content */}
      <div className="tech-terms-content">
        {children}
      </div>
    </div>
  );
}
