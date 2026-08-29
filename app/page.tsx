"use client";

import { useState } from "react";
import NatureInspiration from "@/components/NatureInspiration";
import HomeDashboard from "@/components/HomeDashboard";
import SiteFooter from "@/components/SiteFooter";
import { type DashboardViewId } from "@/lib/dashboard-structure";

export default function Home() {
  const [view, setView] = useState<DashboardViewId>("home");

  return (
    <>
      <div className="home-main">
        <NatureInspiration />
        <HomeDashboard view={view} onChangeView={setView} />
      </div>
      <SiteFooter />
    </>
  );
}
