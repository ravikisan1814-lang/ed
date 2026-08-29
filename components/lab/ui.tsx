"use client";

import { useState } from "react";

export function MeaningPanel({
  title,
  meaning,
  points,
  color = "blue",
}: {
  title: string;
  meaning: string;
  points: string[];
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500/10 to-transparent border-blue-500/20 text-blue-400",
    green: "from-green-500/10 to-transparent border-green-500/20 text-green-400",
    purple: "from-purple-500/10 to-transparent border-purple-500/20 text-purple-400",
    amber: "from-amber-500/10 to-transparent border-amber-500/20 text-amber-400",
    rose: "from-rose-500/10 to-transparent border-rose-500/20 text-rose-400",
    cyan: "from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-400",
  };
  const bg = colorMap[color] || colorMap.blue;

  return (
    <div className={`rounded-lg border bg-gradient-to-br ${bg} p-4 w-full`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Concept & Why It Matters</p>
      <h4 className="mt-1 text-sm font-semibold">{title}</h4>
      <p className="mt-1 text-xs opacity-80">{meaning}</p>
      {points.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs opacity-75">
          {points.map((p, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="opacity-60">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CollapsibleControls({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? "rotate-90" : ""}`}>
          <path d="M9 18l6-6-6-6" />
        </svg>
        {label}
      </button>
      {open && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}

export function LabCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 w-full ${className}`}>
      <div className="flex items-start gap-2 mb-3">
        <h3 className="font-semibold text-base">{title}</h3>
        {subtitle && <span className="text-xs text-muted-foreground mt-0.5">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

export function ResultBadge({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg bg-muted/50 min-w-[80px]">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-mono font-semibold">
        {value}{unit && <span className="text-xs font-normal text-muted-foreground ml-0.5">{unit}</span>}
      </span>
    </div>
  );
}
