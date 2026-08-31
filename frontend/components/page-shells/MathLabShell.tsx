"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import BackButton from "@/components/BackButton";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface MathLabShellProps {
  children: React.ReactNode;
}

export default function MathLabShell({ children }: MathLabShellProps) {
  return (
    <div className="math-lab-shell">
      {/* Hero */}
      <div className="math-lab-hero">
        <div className="math-lab-hero-bg">
          <ThreeScene figureType="coordinate" topicTitle="Math Lab" />
        </div>
        <div className="math-lab-hero-overlay" />
        <div className="math-lab-hero-content">
          <div className="math-lab-hero-badge">🔢 Mathematics</div>
          <h1 className="math-lab-hero-title">
            Mathematics <span className="gradient-text">Laboratory</span>
          </h1>
          <p className="math-lab-hero-desc">
            Visualize functions, explore 3D surfaces, understand derivatives, and manipulate
            matrices — all through interactive mathematical explorations.
          </p>
        </div>
      </div>

      {/* Math-specific stats */}
      <div className="math-lab-stats">
        <div className="math-lab-stat">
          <span className="math-lab-stat-value">6</span>
          <span className="math-lab-stat-label">Experiments</span>
        </div>
        <div className="math-lab-stat">
          <span className="math-lab-stat-value">2D</span>
          <span className="math-lab-stat-label">Grapher</span>
        </div>
        <div className="math-lab-stat">
          <span className="math-lab-stat-value">3D</span>
          <span className="math-lab-stat-label">Surfaces</span>
        </div>
        <div className="math-lab-stat">
          <span className="math-lab-stat-value">Real-time</span>
          <span className="math-lab-stat-label">Calc</span>
        </div>
      </div>

      {/* Main content */}
      <div className="math-lab-content">
        <BackButton href="/lab" />
        {children}
      </div>
    </div>
  );
}
