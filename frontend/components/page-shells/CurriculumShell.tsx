"use client";

import dynamic from "next/dynamic";
import { BookOpen, GraduationCap, ClipboardList, TrendingUp, Users, Target } from "lucide-react";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface CurriculumShellProps {
  children: React.ReactNode;
}

const STATS = [
  { icon: BookOpen, label: "Subjects", value: "6", color: "#3b82f6" },
  { icon: TrendingUp, label: "Total Units", value: "200+", color: "#22c55e" },
  { icon: Users, label: "Tracks", value: "36", color: "#f59e0b" },
  { icon: Target, label: "Exam Groups", value: "4", color: "#8b5cf6" },
];

export default function CurriculumShell({ children }: CurriculumShellProps) {
  return (
    <div className="curriculum-shell">
      {/* Hero */}
      <div className="curriculum-hero">
        <div className="curriculum-hero-bg">
          <ThreeScene figureType="abstract" topicTitle="Curriculum" />
        </div>
        <div className="curriculum-hero-overlay" />
        <div className="curriculum-hero-content">
          <div className="curriculum-hero-badge">
            <GraduationCap className="w-5 h-5" />
            <span>NEB +2 Curriculum</span>
          </div>
          <h1 className="curriculum-hero-title">
            Complete Syllabus & <span className="gradient-text">Curriculum</span>
          </h1>
          <p className="curriculum-hero-desc">
            Explore the full NEB (+2) curriculum structure with past 5 years of syllabus changes,
            subject breakdowns, and detailed topic coverage for all 6 core subjects.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="curriculum-stats">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="curriculum-stat" style={{ borderColor: stat.color + "30" }}>
              <div className="curriculum-stat-icon" style={{ color: stat.color, background: stat.color + "15" }}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="curriculum-stat-value" style={{ color: stat.color }}>{stat.value}</div>
                <div className="curriculum-stat-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="curriculum-content">
        {children}
      </div>
    </div>
  );
}
