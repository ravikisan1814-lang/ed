"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import BackButton from "@/components/BackButton";
import GraphsShell from "@/components/page-shells/GraphsShell";
import { GraphControls } from "@/components/visuals/GraphControls";
import type { SceneParams } from "@/components/visuals/ThreeScene";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

const SUBJECTS = [
  {
    slug: "physics",
    label: "Physics",
    figures: [
      { key: "trajectory", label: "Projectile motion trajectory" },
      { key: "trajectory", label: "Circular motion / centripetal acceleration" },
      { key: "vectorfield", label: "Electric / magnetic field lines" },
      { key: "wave", label: "Wave superposition / interference" },
      { key: "shm", label: "Simple harmonic motion" },
    ],
  },
  {
    slug: "chemistry",
    label: "Chemistry",
    figures: [
      { key: "molecular", label: "VSEPR molecular geometry" },
      { key: "molecular", label: "Crystal lattice structure" },
      { key: "molecular", label: "Atomic orbitals (s, p, d)" },
      { key: "barchart", label: "Periodic trends / comparisons" },
      { key: "bonding", label: "Chemical bonding model" },
    ],
  },
  {
    slug: "mathematics",
    label: "Mathematics",
    figures: [
      { key: "trajectory", label: "3D parabola / conic surface" },
      { key: "trajectory", label: "Hyperboloid / saddle surface" },
      { key: "barchart", label: "Vector addition in 3D" },
      { key: "wave", label: "Spiral / helix curve" },
      { key: "coordinate", label: "Coordinate axes and octants" },
    ],
  },
];

export default function GraphsPage() {
  const [figureParams, setFigureParams] = useState<Record<string, SceneParams>>({});

  const updateParams = (subjectSlug: string, figureIndex: number, next: SceneParams) => {
    const key = `${subjectSlug}-${figureIndex}`;
    setFigureParams((prev) => ({ ...prev, [key]: next }));
  };

  return (
    <GraphsShell>
      <BackButton href="/" />
      <div className="notes-list">
        {SUBJECTS.map((subject) => (
          <article key={subject.slug} className="note-card">
            <h3 className="note-card-title">{subject.label}</h3>
            <div className="note-card-teaser">
              {subject.figures.map((fig, index) => {
                const key = `${subject.slug}-${index}`;
                const params = figureParams[key] ?? {};
                return (
                  <div key={`${fig.key}-${index}`} className="graph-row">
                    <span className="graph-label">{fig.label}</span>
                    <GraphControls figureKey={fig.key} label={fig.label} params={params} onChange={(next) => updateParams(subject.slug, index, next)} />
                    <ThreeScene figureType={fig.key} topicTitle={`${subject.label} — ${fig.label}`} params={params} />
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </GraphsShell>
  );
}
