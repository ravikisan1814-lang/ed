"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import BackButton from "@/components/BackButton";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface BiologyLabShellProps {
  children: React.ReactNode;
}

export default function BiologyLabShell({ children }: BiologyLabShellProps) {
  return (
    <div className="biology-lab-shell">
      {/* Hero */}
      <div className="biology-lab-hero">
        <div className="biology-lab-hero-bg">
          <ThreeScene figureType="molecular" topicTitle="Biology Lab" />
        </div>
        <div className="biology-lab-hero-overlay" />
        <div className="biology-lab-hero-content">
          <div className="biology-lab-hero-badge">🧬 Biology</div>
          <h1 className="biology-lab-hero-title">
            Biology <span className="gradient-text">Laboratory</span>
          </h1>
          <p className="biology-lab-hero-desc">
            Explore the building blocks of life — from DNA double helix to cell structures
            and neurons. Interactive 3D models make biology come alive.
          </p>
        </div>
      </div>

      {/* Biology-specific stats */}
      <div className="biology-lab-stats">
        <div className="biology-lab-stat">
          <span className="biology-lab-stat-value">3</span>
          <span className="biology-lab-stat-label">Models</span>
        </div>
        <div className="biology-lab-stat">
          <span className="biology-lab-stat-value">DNA</span>
          <span className="biology-lab-stat-label">Helix</span>
        </div>
        <div className="biology-lab-stat">
          <span className="biology-lab-stat-value">Cell</span>
          <span className="biology-lab-stat-label">3D View</span>
        </div>
        <div className="biology-lab-stat">
          <span className="biology-lab-stat-value">Neuron</span>
          <span className="biology-lab-stat-label">Structure</span>
        </div>
      </div>

      {/* Main content */}
      <div className="biology-lab-content">
        <BackButton href="/lab" />
        {children}
      </div>
    </div>
  );
}
