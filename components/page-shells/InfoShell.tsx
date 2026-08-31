"use client";

import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface InfoShellProps {
  children: React.ReactNode;
}

export default function InfoShell({ children }: InfoShellProps) {
  return (
    <div className="info-shell">
      {/* Hero */}
      <div className="info-hero">
        <div className="info-hero-bg">
          <ThreeScene figureType="abstract" topicTitle="Rules & Notices" />
        </div>
        <div className="info-hero-overlay" />
        <div className="info-hero-content">
          <div className="info-hero-badge">📋 Guidelines</div>
          <h1 className="info-hero-title">
            Rules & <span className="gradient-text">Notices</span>
          </h1>
          <p className="info-hero-desc">
            Important guidelines and announcements for using Ravikisan&apos;s Platform.
            Read carefully to understand how the tiered access system works.
          </p>
        </div>
      </div>

      {/* Quick info */}
      <div className="info-quick-info">
        <div className="info-quick-item">
          <span className="info-quick-icon">🔒</span>
          <span>Tiered Access System</span>
        </div>
        <div className="info-quick-item">
          <span className="info-quick-icon">✅</span>
          <span>Owner Approval Required</span>
        </div>
        <div className="info-quick-item">
          <span className="info-quick-icon">📧</span>
          <span>Contact: ravikisan1814@gmail.com</span>
        </div>
      </div>

      {/* Main content */}
      <div className="info-content">
        {children}
      </div>
    </div>
  );
}
