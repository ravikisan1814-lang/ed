"use client";

import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface LabShellProps {
  children: React.ReactNode;
}

export default function LabShell({ children }: LabShellProps) {
  return (
    <div className="lab-shell">
      {/* Hero with 3D background */}
      <div className="lab-hero">
        <div className="lab-hero-bg">
          <ThreeScene figureType="molecular" topicTitle="Virtual Laboratory" />
        </div>
        <div className="lab-hero-overlay" />
        <div className="lab-hero-content">
          <div className="lab-hero-badge">🔬 Virtual Lab</div>
          <h1 className="lab-hero-title">
            Interactive <span className="gradient-text">Laboratory</span>
          </h1>
          <p className="lab-hero-desc">
            Explore physics, chemistry, biology, and mathematics through immersive 3D simulations.
            Adjust parameters, visualize concepts, and learn by doing.
          </p>
        </div>
      </div>

      {/* Lab stats */}
      <div className="lab-stats">
        <div className="lab-stat">
          <span className="lab-stat-value">8</span>
          <span className="lab-stat-label">Simulations</span>
        </div>
        <div className="lab-stat">
          <span className="lab-stat-value">4</span>
          <span className="lab-stat-label">Subjects</span>
        </div>
        <div className="lab-stat">
          <span className="lab-stat-value">3D</span>
          <span className="lab-stat-label">Interactive</span>
        </div>
        <div className="lab-stat">
          <span className="lab-stat-value">Real-time</span>
          <span className="lab-stat-label">Animation</span>
        </div>
      </div>

      {/* Main content */}
      <div className="lab-content">
        {children}
      </div>
    </div>
  );
}
