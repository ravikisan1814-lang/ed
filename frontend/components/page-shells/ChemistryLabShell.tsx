"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import BackButton from "@/components/BackButton";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface ChemistryLabShellProps {
  children: React.ReactNode;
}

export default function ChemistryLabShell({ children }: ChemistryLabShellProps) {
  return (
    <div className="chemistry-lab-shell">
      {/* Hero */}
      <div className="chemistry-lab-hero">
        <div className="chemistry-lab-hero-bg">
          <ThreeScene figureType="molecular" topicTitle="Chemistry Lab" />
        </div>
        <div className="chemistry-lab-hero-overlay" />
        <div className="chemistry-lab-hero-content">
          <div className="chemistry-lab-hero-badge">⚗️ Chemistry</div>
          <h1 className="chemistry-lab-hero-title">
            Chemistry <span className="gradient-text">Laboratory</span>
          </h1>
          <p className="chemistry-lab-hero-desc">
            Visualize the periodic table in 3D, explore molecular geometries, and understand
            pH scales through interactive models. See chemistry from a new perspective.
          </p>
        </div>
      </div>

      {/* Chemistry-specific stats */}
      <div className="chemistry-lab-stats">
        <div className="chemistry-lab-stat">
          <span className="chemistry-lab-stat-value">118</span>
          <span className="chemistry-lab-stat-label">Elements</span>
        </div>
        <div className="chemistry-lab-stat">
          <span className="chemistry-lab-stat-value">8</span>
          <span className="chemistry-lab-stat-label">Molecules</span>
        </div>
        <div className="chemistry-lab-stat">
          <span className="chemistry-lab-stat-value">pH</span>
          <span className="chemistry-lab-stat-label">Scale</span>
        </div>
        <div className="chemistry-lab-stat">
          <span className="chemistry-lab-stat-value">3D</span>
          <span className="chemistry-lab-stat-label">Models</span>
        </div>
      </div>

      {/* Main content */}
      <div className="chemistry-lab-content">
        <BackButton href="/lab" />
        {children}
      </div>
    </div>
  );
}
