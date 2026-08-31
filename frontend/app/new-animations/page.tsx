"use client";

import NewInteractive3D from "@/components/visuals/NewInteractive3D";
import NewArt3D from "@/components/visuals/NewArt3D";
import New3DAnimation from "@/components/visuals/New3DAnimation";
import "./page.css";

export default function NewAnimationsPage() {
  return (
    <div className="new-animations-page">
      <div className="animations-hero">
        <h1>🎨 New Interactive 3D Animations</h1>
        <p>Completely redesigned with mouse interaction, morphing shapes, and particle effects</p>
      </div>

      <div className="animations-section">
        <div className="section-header">
          <h2>Interactive Playground</h2>
          <p>Click shapes to morph • Drag to orbit • Scroll to zoom</p>
        </div>
        <NewInteractive3D />
      </div>

      <div className="animations-section">
        <div className="section-header">
          <h2>Art Installation</h2>
          <p>Liquid blobs follow your mouse • Crystal refractions • Neon glows</p>
        </div>
        <NewArt3D />
      </div>

      <div className="animations-section">
        <div className="section-header">
          <h2>Basic Shapes</h2>
          <p>Seven geometric forms with smooth animations</p>
        </div>
        <New3DAnimation />
      </div>

      <div className="animations-footer">
        <p>All animations are fully interactive and responsive</p>
      </div>
    </div>
  );
}
