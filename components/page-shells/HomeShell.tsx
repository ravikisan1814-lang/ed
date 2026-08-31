"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import NatureInspiration from "@/components/NatureInspiration";
import HomeDashboard from "@/components/HomeDashboard";
import SiteFooter from "@/components/SiteFooter";
import { type DashboardViewId } from "@/lib/dashboard-structure";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

interface HomeShellProps {
  view: DashboardViewId;
  onChangeView: (v: DashboardViewId) => void;
  children?: React.ReactNode;
}

export default function HomeShell({ view, onChangeView, children }: HomeShellProps) {
  return (
    <div className="home-shell">
      <div className="home-shell-bg">
        <ThreeScene figureType="abstract" topicTitle="Welcome" />
      </div>
      <div className="home-shell-overlay" />
      <div className="home-shell-content">
        <NatureInspiration />
        <HomeDashboard view={view} onChangeView={onChangeView} />
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
