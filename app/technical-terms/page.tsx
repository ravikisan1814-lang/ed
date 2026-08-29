"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import BackButton from "@/components/BackButton";
import ParticleField from "@/components/visuals/ParticleField";
import GeometricMorph from "@/components/visuals/GeometricMorph";
import {
  GradientText,
  AnimatedCounter,
  GlowCard,
  Typewriter,
  ProgressRing,
  FloatingBadge,
  PulseDot,
  Skeleton,
  StatCard,
} from "@/components/visuals/Animations";
import VizPanel from "@/components/visuals/VizPanel";

const ThreeScene = dynamic(() => import("@/components/visuals/ThreeScene"), {
  ssr: false,
});

const TECH_TERMS = [
  {
    slug: "kinematics",
    name: "Kinematics",
    icon: "⚡",
    color: "#3b82f6",
    description: "The branch of mechanics that describes the motion of points, bodies without considering the forces that cause the motion.",
    concept: "Velocity is the rate of change of position. Acceleration is the rate of change of velocity.",
    formula: "v = u + at, s = ut + ½at², v² = u² + 2as",
    figureType: "trajectory",
    topics: ["Displacement", "Velocity", "Acceleration", "Projectile Motion"],
  },
  {
    slug: "thermodynamics",
    name: "Thermodynamics",
    icon: "🔥",
    color: "#f97316",
    description: "The branch of physics dealing with heat, work, and temperature, and their relation to energy, entropy, and the physical properties of matter.",
    concept: "Energy cannot be created or destroyed, only transformed. Entropy of an isolated system always increases.",
    formula: "ΔU = Q - W, Q = mcΔT, PV = nRT",
    figureType: "wave",
    topics: ["Heat Transfer", "Entropy", "Engines", "Ideal Gas Law"],
  },
  {
    slug: "electromagnetism",
    name: "Electromagnetism",
    icon: "⚡",
    color: "#8b5cf6",
    description: "The branch of physics involving the study of electromagnetic force, one of the four fundamental forces of nature.",
    concept: "Moving charges create magnetic fields. Changing magnetic fields create electric fields.",
    formula: "F = q(E + v×B), ∇·E = ρ/ε₀, ∇×B = μ₀J",
    figureType: "vectorfield",
    topics: ["Electric Field", "Magnetic Field", "Maxwell's Equations", "Induction"],
  },
  {
    slug: "quantum-mechanics",
    name: "Quantum Mechanics",
    icon: "⚛️",
    color: "#06b6d4",
    description: "The branch of physics that deals with the behavior of matter and light on the atomic and subatomic scale.",
    concept: "Particles exhibit both wave and particle properties. Energy is quantized in discrete packets.",
    formula: "E = hν, Δx·Δp ≥ ℏ/2, iℏ∂ψ/∂t = Ĥψ",
    figureType: "molecular",
    topics: ["Wave-Particle Duality", "Uncertainty Principle", "Schrödinger Equation", "Quantum Tunneling"],
  },
  {
    slug: "relativity",
    name: "Relativity",
    icon: "🌌",
    color: "#ec4899",
    description: "Einstein's theory describing gravity as the curvature of spacetime, and the relationship between space and time.",
    concept: "The laws of physics are the same for all observers. Nothing can travel faster than light.",
    formula: "E = mc², ds² = -c²dt² + dx², G_μν = 8πG/c⁴ T_μν",
    figureType: "coordinate",
    topics: ["Special Relativity", "Time Dilation", "General Relativity", "Spacetime"],
  },
  {
    slug: "optics",
    name: "Optics",
    icon: "💡",
    color: "#eab308",
    description: "The branch of physics that studies the behavior and properties of light, including its interactions with matter.",
    concept: "Light travels in straight lines. It can be reflected, refracted, and diffracted.",
    formula: "n₁sinθ₁ = n₂sinθ₂, 1/f = 1/v + 1/u, λ = c/f",
    figureType: "wave",
    topics: ["Reflection", "Refraction", "Interference", "Diffraction"],
  },
  {
    slug: "nuclear-physics",
    name: "Nuclear Physics",
    icon: "☢️",
    color: "#22c55e",
    description: "The field of physics that studies atomic nuclei and their constituents and interactions.",
    concept: "Nuclear binding energy holds the nucleus together. Radioactive decay transforms unstable nuclei.",
    formula: "E = Δmc², N = N₀e^(-λt), E_b = Δm·c²",
    figureType: "molecular",
    topics: ["Nuclear Structure", "Radioactivity", "Fission", "Fusion"],
  },
  {
    slug: "waves-sound",
    name: "Waves & Sound",
    icon: "🔊",
    color: "#14b8a6",
    description: "The study of mechanical vibrations propagating through a medium, carrying energy without transferring matter.",
    concept: "Waves transfer energy. Sound needs a medium; light doesn't. Frequency determines pitch.",
    formula: "v = fλ, f = 1/T, I = P/4πr²",
    figureType: "wave",
    topics: ["Wave Properties", "Sound Waves", "Doppler Effect", "Standing Waves"],
  },
];

export default function TechnicalTermsPage() {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  return (
    <>
      <BackButton href="/" />
      {/* Particle background */}
      <div className="technical-terms-bg">
        <ParticleField count={60} color={theme === "dark" ? "#60a5fa" : "#3b82f6"} speed={0.3} />
      </div>

      <section className="tech-hero">
        <div className="tech-hero-content">
          <FloatingBadge delay={0}><PulseDot color="#22c55e" /></FloatingBadge>
          <GradientText className="tech-hero-title">Technical Terms</GradientText>
          <p className="tech-hero-sub">
            <Typewriter
              texts={[
                "Master the fundamental concepts of physics and chemistry",
                "Visualize abstract principles through interactive 3D models",
                "Explore the mathematical beauty behind natural phenomena",
              ]}
            />
          </p>
          <div className="tech-hero-stats">
            <StatCard label="Core Concepts" value={24} suffix="+" icon={<span>📚</span>} />
            <StatCard label="3D Simulations" value={12} suffix="" icon={<span>🎮</span>} />
            <StatCard label="Formulas" value={50} suffix="+" icon={<span>📐</span>} />
            <StatCard label="Topics Covered" value={8} suffix="" icon={<span>🎯</span>} />
          </div>
        </div>
      </section>

      {/* Theme toggle and controls */}
      <section className="tech-controls">
        <div className="tech-control-group">
          <span className="tech-control-label">Theme</span>
          <button
            className={`theme-btn ${theme === "dark" ? "active" : ""}`}
            onClick={() => setTheme("dark")}
          >
            🌙 Dark
          </button>
          <button
            className={`theme-btn ${theme === "light" ? "active" : ""}`}
            onClick={() => setTheme("light")}
          >
            ☀️ Light
          </button>
        </div>
        <div className="tech-control-group">
          <span className="tech-control-label">Progress</span>
          <div className="tech-progress">
            <ProgressRing percent={65} size={50} color="#22c55e" />
            <span className="tech-progress-label">65% Complete</span>
          </div>
        </div>
      </section>

      {/* Terms grid */}
      <section className="tech-terms-grid">
        {TECH_TERMS.map((term, idx) => (
          <GlowCard
            key={term.slug}
            className={`tech-term-card ${activeTerm === term.slug ? "active" : ""}`}
            color={term.color}
          >
            <div className="tech-term-header">
              <span className="tech-term-icon" style={{ color: term.color }}>{term.icon}</span>
              <h3 className="tech-term-name">{term.name}</h3>
              <span className="tech-term-badge" style={{ backgroundColor: term.color + "22", color: term.color }}>
                {idx + 1}
              </span>
            </div>
            <p className="tech-term-desc">{term.description}</p>

            <div className="tech-term-concept">
              <span className="tech-term-label">Key Concept</span>
              <p>{term.concept}</p>
            </div>

            <div className="tech-term-formula">
              <span className="tech-term-label">Formula</span>
              <code>{term.formula}</code>
            </div>

            <div className="tech-term-topics">
              {term.topics.map((topic) => (
                <span key={topic} className="tech-topic-tag">{topic}</span>
              ))}
            </div>

            <button
              className="tech-term-btn"
              style={{ borderColor: term.color, color: term.color }}
              onClick={() => setActiveTerm(activeTerm === term.slug ? null : term.slug)}
            >
              {activeTerm === term.slug ? "▲ Collapse" : "▼ Explore 3D"}
            </button>

            {activeTerm === term.slug && (
              <div className="tech-term-3d">
                <VizPanel title={`${term.name} — 3D Visualization`} defaultOpen={true}>
                  <ThreeScene figureType={term.figureType} topicTitle={term.name} />
                </VizPanel>
                <GeometricMorph type="torus" morphSpeed={0.8} />
              </div>
            )}
          </GlowCard>
        ))}
      </section>

      {/* Interactive animation showcase */}
      <section className="tech-animation-showcase">
        <h2>Interactive Animations</h2>
        <div className="tech-animation-grid">
          <GlowCard color="#60a5fa">
            <h3>Particle Field</h3>
            <ParticleField count={40} color="#60a5fa" speed={0.4} size={2} />
            <p className="tech-animation-desc">80+ particles with proximity-based connections. Simulates molecular motion.</p>
          </GlowCard>

          <GlowCard color="#a78bfa">
            <h3>Geometric Morphing</h3>
            <div className="morph-container">
              <GeometricMorph type="sphere" morphSpeed={1.2} />
            </div>
            <p className="tech-animation-desc">Smooth interpolation between torus, sphere, cube, and icosahedron geometries.</p>
          </GlowCard>

          <GlowCard color="#34d399">
            <h3>Animated Counters</h3>
            <div className="counter-demo">
              <div className="counter-item">
                <span className="counter-value"><AnimatedCounter target={135} suffix="" /></span>
                <span className="counter-label">Topics</span>
              </div>
              <div className="counter-item">
                <span className="counter-value"><AnimatedCounter target={24} suffix="+" /></span>
                <span className="counter-label">Concepts</span>
              </div>
              <div className="counter-item">
                <span className="counter-value"><AnimatedCounter target={50} suffix="+" /></span>
                <span className="counter-label">Formulas</span>
              </div>
            </div>
            <p className="tech-animation-desc">Numbers animate when scrolled into view using IntersectionObserver.</p>
          </GlowCard>

          <GlowCard color="#f472b6">
            <h3>Progress Tracking</h3>
            <div className="progress-demo">
              {[
                { label: "Physics", percent: 78, color: "#3b82f6" },
                { label: "Chemistry", percent: 65, color: "#f97316" },
                { label: "Mathematics", percent: 92, color: "#22c55e" },
                { label: "Biology", percent: 45, color: "#ec4899" },
              ].map((item) => (
                <div key={item.label} className="progress-item">
                  <span className="progress-label">{item.label}</span>
                  <ProgressRing percent={item.percent} size={44} color={item.color} />
                </div>
              ))}
            </div>
            <p className="tech-animation-desc">Circular progress indicators for tracking learning progress per subject.</p>
          </GlowCard>

          <GlowCard color="#fbbf24">
            <h3>Typewriter Effect</h3>
            <div className="typewriter-demo">
              <Typewriter
                texts={["Newton's Laws", "Thermodynamics", "Quantum Mechanics", "Electromagnetism"]}
                speed={60}
                pause={1500}
              />
            </div>
            <p className="tech-animation-desc">Rotating text animation typing and deleting key physics topics.</p>
          </GlowCard>

          <GlowCard color="#22d3ee">
            <h3>Glow Cards</h3>
            <div className="glow-demo">
              <GlowCard color="#3b82f6" className="glow-demo-card">
                <span>Blue Glow</span>
              </GlowCard>
              <GlowCard color="#ef4444" className="glow-demo-card">
                <span>Red Glow</span>
              </GlowCard>
              <GlowCard color="#22c55e" className="glow-demo-card">
                <span>Green Glow</span>
              </GlowCard>
            </div>
            <p className="tech-animation-desc">Cards with customizable glow effects matching the content theme color.</p>
          </GlowCard>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="tech-reference">
        <h2>Quick Reference</h2>
        <div className="reference-grid">
          {[
            { term: "Velocity", formula: "v = dx/dt", unit: "m/s" },
            { term: "Acceleration", formula: "a = dv/dt", unit: "m/s²" },
            { term: "Force", formula: "F = ma", unit: "N" },
            { term: "Energy", formula: "E = mc²", unit: "J" },
            { term: "Power", formula: "P = W/t", unit: "W" },
            { term: "Momentum", formula: "p = mv", unit: "kg·m/s" },
            { term: "Work", formula: "W = F·d", unit: "J" },
            { term: "Pressure", formula: "P = F/A", unit: "Pa" },
          ].map((ref) => (
            <div key={ref.term} className="reference-item">
              <span className="reference-term">{ref.term}</span>
              <code className="reference-formula">{ref.formula}</code>
              <span className="reference-unit">{ref.unit}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
