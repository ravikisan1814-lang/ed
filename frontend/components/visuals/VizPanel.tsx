"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface VizPanelProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  testId?: string;
  actions?: ReactNode;
}

export default function VizPanel({ title, children, defaultOpen = true, testId, actions }: VizPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="viz-panel" data-testid={testId} role="region" aria-label={title}>
      <div className="viz-panel-header">
        <button
          className="viz-panel-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`viz-panel-body-${testId}`}
        >
          <svg
            className={`viz-panel-caret ${isOpen ? "open" : ""}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="viz-panel-title">{title}</span>
        </button>
        {actions && <div className="viz-panel-actions">{actions}</div>}
      </div>
      {isOpen && (
        <div className="viz-panel-body" id={`viz-panel-body-${testId}`} role="region">
          {children}
        </div>
      )}
    </div>
  );
}
