"use client";

import { useState } from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import LabShell from "@/components/page-shells/LabShell";

const LAB_SUBJECTS = [
  {
    key: "physics",
    label: "Physics",
    icon: "⚡",
    description: "Mechanics, waves, optics, electromagnetism, and modern physics",
    color: "from-blue-500 to-cyan-500",
    href: "/lab/physics",
    simulations: 5,
  },
  {
    key: "chemistry",
    label: "Chemistry",
    icon: "⚗️",
    description: "Periodic table, molecular models, and pH scale",
    color: "from-purple-500 to-violet-500",
    href: "/lab/chemistry",
    simulations: 3,
  },
  {
    key: "biology",
    label: "Biology",
    icon: "🧬",
    description: "DNA, cell structures, and neuron models",
    color: "from-green-500 to-emerald-500",
    href: "/lab/biology",
    simulations: 3,
  },
  {
    key: "math",
    label: "Mathematics",
    icon: "🔢",
    description: "Function grapher, 3D surfaces, derivatives, and matrices",
    color: "from-orange-500 to-amber-500",
    href: "/lab/math",
    simulations: 6,
  },
] as const;

export default function LabPage() {
  return (
    <LabShell>
      <BackButton href="/" />

      {/* Subject selection grid */}
      <div className="lab-subject-grid">
        {LAB_SUBJECTS.map((subject) => (
          <Link
            key={subject.key}
            href={subject.href}
            className="lab-subject-card"
          >
            <div className={`lab-subject-card-gradient ${subject.color}`} />
            <div className="lab-subject-card-content">
              <span className="lab-subject-icon">{subject.icon}</span>
              <h3 className="lab-subject-name">{subject.label}</h3>
              <p className="lab-subject-desc">{subject.description}</p>
              <div className="lab-subject-meta">
                <span className="lab-subject-simulations">{subject.simulations} simulations</span>
                <span className="lab-subject-arrow">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links to each subject */}
      <div className="lab-quick-links">
        <h2 className="lab-section-title">Quick Access</h2>
        <div className="lab-quick-grid">
          {LAB_SUBJECTS.map((subject) => (
            <Link
              key={subject.key}
              href={subject.href}
              className="lab-quick-card"
            >
              <span className="lab-quick-icon">{subject.icon}</span>
              <span className="lab-quick-label">{subject.label} Lab</span>
            </Link>
          ))}
        </div>
      </div>
    </LabShell>
  );
}
