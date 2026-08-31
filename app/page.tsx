"use client";

import { useState } from "react";
import NatureInspiration from "@/components/NatureInspiration";
import HomeDashboard from "@/components/HomeDashboard";
import SiteFooter from "@/components/SiteFooter";
import HomeShell from "@/components/page-shells/HomeShell";
import { type DashboardViewId } from "@/lib/dashboard-structure";

export default function Home() {
  const [view, setView] = useState<DashboardViewId>("home");

  return (
    <HomeShell view={view} onChangeView={setView}>
      <NatureInspiration />
      <HomeDashboard view={view} onChangeView={setView} />
      {view === "home" && <SiteFooter />}
    </HomeShell>
  );
}
