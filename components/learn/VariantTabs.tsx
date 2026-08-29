"use client";

interface VariantTabsProps {
  labels: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  locked: boolean;
}

export default function VariantTabs({ labels, activeIndex, onSelect, locked }: VariantTabsProps) {
  if (locked || labels.length === 0) return null;

  return (
    <div className="content-tabs" role="region" aria-label="Content variants">
      <div className="content-tabs-header">
        <h2 className="content-tabs-title">Learning Modes</h2>
        <div className="content-tabs-list" role="tablist" aria-label="Select content variant">
          {labels.map((label, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={activeIndex === idx}
              aria-controls={`panel-${idx}`}
              id={`tab-${idx}`}
              className={`content-tab-btn ${activeIndex === idx ? "content-tab-btn-active" : ""}`}
              onClick={() => onSelect(idx)}
              disabled={locked}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
