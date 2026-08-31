"use client";

import { useEffect, useRef } from "react";
import type { Data, Layout, Config } from "plotly.js-dist-min";

interface PlotlyChartProps {
  data: Data[];
  layout: Partial<Layout>;
  config?: Partial<Config>;
  height?: number;
  className?: string;
}

export default function PlotlyChart({ data, layout, config, height = 400, className }: PlotlyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotlyRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    async function init() {
      try {
        const plotly = await import("plotly.js-dist-min");
        if (cancelled || !container) return;

        if (plotlyRef.current) {
          plotlyRef.current.close();
          plotlyRef.current = null;
        }

        plotlyRef.current = await plotly.newPlot(container, data, layout, config || {});

        const resize = () => {
          if (cancelled || !container) return;
          plotly.react(container, data, layout, config || {});
        };

        const observer = new ResizeObserver(resize);
        observer.observe(container);

        return () => {
          observer.disconnect();
        };
      } catch (err) {
        console.error("PlotlyChart initialization failed:", err);
        if (!cancelled && containerRef.current) {
          containerRef.current.textContent = "Chart failed to load.";
          containerRef.current.setAttribute("role", "alert");
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (plotlyRef.current) {
        plotlyRef.current.close();
        plotlyRef.current = null;
      }
    };
  }, [data, layout, config]);

  return (
    <div
      ref={containerRef}
      className={className ?? "plotly-chart"}
      style={{ height }}
      aria-label="Interactive chart visualization"
      role="img"
    />
  );
}
