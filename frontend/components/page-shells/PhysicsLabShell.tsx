"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import BackButton from "@/components/BackButton";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface PhysicsLabShellProps {
  children: React.ReactNode;
}

export default function PhysicsLabShell({ children }: PhysicsLabShellProps) {
  return (
    <div className="physics-lab-shell">
      {/* Hero */}
      <div className="physics-lab-hero">
        <div className="physics-lab-hero-bg">
          <ThreeScene figureType="trajectory" topicTitle="Physics Lab" />
        </div>
        <div className="physics-lab-hero-overlay" />
        <div className="physics-lab-hero-content">
          <div className="physics-lab-hero-badge">⚡ Physics</div>
          <h1 className="physics-lab-hero-title">
            Physics <span className="gradient-text">Laboratory</span>
          </h1>
          <p className="physics-lab-hero-desc">
            Explore classical mechanics, waves, optics, electromagnetism, and modern physics
            through interactive 3D simulations. Adjust parameters and watch physics come alive.
          </p>
        </div>
      </div>

      {/* Physics-specific stats */}
      <div className="physics-lab-stats">
        <div className="physics-lab-stat">
          <span className="physics-lab-stat-value">5</span>
          <span className="physics-lab-stat-label">Simulations</span>
        </div>
        <div className="physics-lab-stat">
          <span className="physics-lab-stat-value">3D</span>
          <span className="physics-lab-stat-label">Interactive</span>
        </div>
        <div className="physics-lab-stat">
          <span className="physics-lab-stat-value">Real-time</span>
          <span className="physics-lab-stat-label">Animation</span>
        </div>
        <div className="physics-lab-stat">
          <span className="physics-lab-stat-value">Formula</span>
          <span className="physics-lab-stat-label">Reference</span>
        </div>
      </div>

      {/* Main content */}
      <div className="physics-lab-content">
        <BackButton href="/lab" />
        {children}
      </div>
    </div>
  );
}
