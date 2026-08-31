"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton";
import LabShell from "@/components/page-shells/LabShell";
import MathLab from "@/components/lab/math-lab";
import ChemistryLab from "@/components/lab/chemistry-lab";
import PhysicsLab from "@/components/lab/physics-lab";
import BiologyLab from "@/components/lab/biology-lab";

const TABS = [
  { key: "math", label: "Mathematics" },
  { key: "chemistry", label: "Chemistry" },
  { key: "physics", label: "Physics" },
  { key: "biology", label: "Biology" },
] as const;

export default function LabPage() {
  const [activeTab, setActiveTab] = useState<string>("physics");

  return (
    <LabShell>
      <BackButton href="/" />
      {/* Tab navigation */}
      <nav className="px-4 pt-4" aria-label="Lab sections">
        <div className="flex flex-wrap gap-2 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.key
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <section className="content-section max-w-6xl mx-auto px-4 pb-8">
        {activeTab === "math" && <MathLab />}
        {activeTab === "chemistry" && <ChemistryLab />}
        {activeTab === "physics" && <PhysicsLab />}
        {activeTab === "biology" && <BiologyLab />}
      </section>
    </LabShell>
  );
}
