"use client";

import { useEffect, useRef, useState } from "react";

/** Animated counter component */
export function AnimatedCounter({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const animate = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/** Animated gradient text */
export function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`gradient-text ${className}`}>{children}</span>;
}

/** Glowing border card */
export function GlowCard({ children, className = "", color = "#60a5fa" }: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <div
      className={`glow-card ${className}`}
      style={color ? { "--glow-color": color } as React.CSSProperties : undefined}
    >
      {children}
    </div>
  );
}

/** Typewriter effect */
export function Typewriter({ texts, speed = 80, pause = 2000 }: { texts: string[]; speed?: number; pause?: number }) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setCharIndex(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex(c => c - 1);
        } else {
          setDeleting(false);
          setTextIndex(i => (i + 1) % texts.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts, speed, pause]);

  return (
    <span className="typewriter">
      {texts[textIndex].slice(0, charIndex)}
      <span className="typewriter-cursor">|</span>
    </span>
  );
}

/** Progress ring */
export function ProgressRing({ percent, size = 80, strokeWidth = 6, color = "#3b82f6" }: { percent: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="progress-ring-circle"
      />
      <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="progress-ring-text">{percent}%</text>
    </svg>
  );
}

/** Floating badge */
export function FloatingBadge({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="floating-badge" style={{ "--animation-delay": `${delay}s` } as React.CSSProperties}>
      {children}
    </span>
  );
}

/** Pulse dot */
export function PulseDot({ color = "#22c55e" }: { color?: string }) {
  return <span className="pulse-dot" style={color ? { "--pulse-color": color } as React.CSSProperties : undefined} />;
}

/** Skeleton loader */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

/** Stat card */
export function StatCard({ label, value, suffix = "", icon }: { label: string; value: number; suffix?: string; icon?: React.ReactNode }) {
  return (
    <GlowCard className="stat-card">
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-value">
        <AnimatedCounter target={value} suffix={suffix} />
      </div>
      <div className="stat-label">{label}</div>
    </GlowCard>
  );
}
