"use client";

import BackButton from "@/components/BackButton";

const OWNER_EMAIL = "ravikisan1814@gmail.com";

export default function InfoPage() {
  return (
    <div className="info-page">
      <BackButton href="/" label="Back to Home" />
      <section className="info-hero">
        <h1>Official Rules & Notices</h1>
        <p>Important guidelines for using Ravikisan&apos;s Platform.</p>
      </section>

      <section className="info-section">
        <h2>Website rules</h2>
        <div className="coming-soon">Coming 🔜</div>
      </section>

      <section className="info-section">
        <h2>Official notices</h2>
        <div className="coming-soon">Coming 🔜</div>
      </section>

      <section className="info-section info-contact">
        <h2>Contact</h2>
        <p>
          For any questions or access requests, contact the owner at{" "}
          <a href={"mailto:" + OWNER_EMAIL}>{OWNER_EMAIL}</a>.
        </p>
      </section>
    </div>
  );
}
