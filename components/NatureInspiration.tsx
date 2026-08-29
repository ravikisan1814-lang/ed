"use client";

import { useState, useEffect } from "react";

const NATURE_LINES = [
  "Nature does not hurry, yet everything is accomplished. — Lao Tzu",
  "Look deep into nature, and then you will understand everything better. — Einstein",
  "In every walk with nature, one receives far more than he seeks. — John Muir",
  "The earth has music for those who listen. — Shakespeare",
  "Adopt the pace of nature: her secret is patience. — Ralph Waldo Emerson",
  "Nature is not a place to visit. It is home. — Gary Snyder",
  "The clearest way into the Universe is through a forest wilderness. — John Muir",
  "Study nature, love nature, stay close to nature. It will never fail you. — Frank Lloyd Wright",
];

export default function NatureInspiration() {
  const [lineIndex, setLineIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setLineIndex((i) => (i + 1) % NATURE_LINES.length);
        setVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="nature-inspire" role="region" aria-label="Daily inspiration" aria-live="polite">
      <div className="nature-inspire-inner">
        <span className="nature-inspire-icon" aria-hidden="true">🌿</span>
        <p
          className={`nature-inspire-line ${visible ? "nature-inspire-line--visible" : ""}`}
          aria-hidden={!visible}
        >
          {NATURE_LINES[lineIndex]}
        </p>
      </div>
    </div>
  );
}
