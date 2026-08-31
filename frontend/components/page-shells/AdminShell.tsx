"use client";

import dynamic from "next/dynamic";
import { Shield, CheckCircle, Lock, Star } from "lucide-react";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="admin-shell">
      {/* Hero */}
      <div className="admin-hero">
        <div className="admin-hero-bg">
          <ThreeScene figureType="abstract" topicTitle="Admin Panel" />
        </div>
        <div className="admin-hero-overlay" />
        <div className="admin-hero-content">
          <div className="admin-hero-badge">
            <Shield className="w-4 h-4" />
            <span>Owner Access Only</span>
          </div>
          <h1 className="admin-hero-title">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="admin-hero-desc">
            Manage users, content, and platform settings. This area is restricted to the site owner only.
          </p>
        </div>
      </div>

      {/* Admin stats */}
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat-icon" style={{ background: "#dcfce7", color: "#166534" }}>
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="admin-stat-value">Members</div>
            <div className="admin-stat-label">Manage access tiers</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon" style={{ background: "#fef3c7", color: "#92400e" }}>
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="admin-stat-value">Content</div>
            <div className="admin-stat-label">Upload & manage notes</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon" style={{ background: "#dbeafe", color: "#1e40af" }}>
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="admin-stat-value">Security</div>
            <div className="admin-stat-label">Platform configuration</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
