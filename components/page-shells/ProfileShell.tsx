"use client";

import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface ProfileShellProps {
  children: React.ReactNode;
}

export default function ProfileShell({ children }: ProfileShellProps) {
  return (
    <div className="profile-shell">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero-bg">
          <ThreeScene figureType="abstract" topicTitle="Your Profile" />
        </div>
        <div className="profile-hero-overlay" />
        <div className="profile-hero-content">
          <div className="profile-hero-badge">👤 My Account</div>
          <h1 className="profile-hero-title">
            Your <span className="gradient-text">Profile</span>
          </h1>
          <p className="profile-hero-desc">
            View your account details, access tier, and subscription status.
            Manage your learning journey from here.
          </p>
        </div>
      </div>

      {/* Profile quick info */}
      <div className="profile-quick-info">
        <div className="profile-quick-item">
          <span className="profile-quick-icon">📊</span>
          <span>Access Tier</span>
        </div>
        <div className="profile-quick-item">
          <span className="profile-quick-icon">✅</span>
          <span>Account Status</span>
        </div>
        <div className="profile-quick-item">
          <span className="profile-quick-icon">📅</span>
          <span>Member Since</span>
        </div>
      </div>

      {/* Main content */}
      <div className="profile-content">
        {children}
      </div>
    </div>
  );
}
