"use client";

import BackButton from "@/components/BackButton";

export default function LabTheoryPage() {
  return (
    <>
      <BackButton href="/lab" />
      <section className="hero hero-premium">
        <span className="hero-badge">Lab — Theory</span>
        <h1>Lab Theory</h1>
        <p>Theoretical concepts and principles behind each experiment.</p>
      </section>

      <section className="content-section">
        <div className="under-development">
          <span className="ud-icon">🔮</span>
          <span>Under development — will be added in future update</span>
        </div>
      </section>
    </>
  );
}
