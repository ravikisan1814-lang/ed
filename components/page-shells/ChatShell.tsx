"use client";

import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface ChatShellProps {
  children: React.ReactNode;
}

export default function ChatShell({ children }: ChatShellProps) {
  return (
    <div className="chat-shell">
      {/* Hero */}
      <div className="chat-hero">
        <div className="chat-hero-bg">
          <ThreeScene figureType="abstract" topicTitle="AI Chat" />
        </div>
        <div className="chat-hero-overlay" />
        <div className="chat-hero-content">
          <div className="chat-hero-badge">🤖 AI-Powered</div>
          <h1 className="chat-hero-title">
            AI <span className="gradient-text">Chat</span>
          </h1>
          <p className="chat-hero-desc">
            Get instant help with your studies. Ask questions about physics, chemistry,
            mathematics, biology, or any subject — our AI tutor is here 24/7.
          </p>
        </div>
      </div>

      {/* Chat features */}
      <div className="chat-features">
        <div className="chat-feature">
          <span className="chat-feature-icon">💡</span>
          <span className="chat-feature-text">Instant Answers</span>
        </div>
        <div className="chat-feature">
          <span className="chat-feature-icon">📚</span>
          <span className="chat-feature-text">Subject Coverage</span>
        </div>
        <div className="chat-feature">
          <span className="chat-feature-icon">🎯</span>
          <span className="chat-feature-text">NEB Aligned</span>
        </div>
        <div className="chat-feature">
          <span className="chat-feature-icon">⚡</span>
          <span className="chat-feature-text">Real-time</span>
        </div>
      </div>

      {/* Main content */}
      <div className="chat-content">
        {children}
      </div>
    </div>
  );
}
