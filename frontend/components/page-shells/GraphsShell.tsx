"use client";

import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface GraphsShellProps {
  children: React.ReactNode;
}

export default function GraphsShell({ children }: GraphsShellProps) {
  return (
    <div className="graphs-shell">
      {/* Hero with 3D background */}
      <div className="graphs-hero">
        <div className="graphs-hero-bg">
          <ThreeScene figureType="wave" topicTitle="Graphs & Figures" />
        </div>
        <div className="graphs-hero-overlay" />
        <div className="graphs-hero-content">
          <div className="graphs-hero-badge">📊 Visual Analytics</div>
          <h1 className="graphs-hero-title">
            Graphs & <span className="gradient-text">Figures</span>
          </h1>
          <p className="graphs-hero-desc">
            Interactive visualizations across physics, chemistry, and mathematics.
            Adjust sliders to see how each concept responds to changes in variables.
          </p>
        </div>
      </div>

      {/* Graph stats */}
      <div className="graphs-stats">
        <div className="graphs-stat">
          <span className="graphs-stat-value">15+</span>
          <span className="graphs-stat-label">Figures</span>
        </div>
        <div className="graphs-stat">
          <span className="graphs-stat-value">3</span>
          <span className="graphs-stat-label">Subjects</span>
        </div>
        <div className="graphs-stat">
          <span className="graphs-stat-value">Interactive</span>
          <span className="graphs-stat-label">Controls</span>
        </div>
      </div>

      {/* Main content */}
      <div className="graphs-content">
        {children}
      </div>
    </div>
  );
}
