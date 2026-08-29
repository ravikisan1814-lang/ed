"use client";

import { useEffect, useRef, useState } from "react";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
}

export default function ParticleField({ count = 80, color = "#60a5fa", speed = 0.5, size = 3 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number }>>([]);
  const animRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current!
    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
    if (!ctx) return;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      life: Math.random(),
    }));

    function animate() {
      (ctx as CanvasRenderingContext2D).clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.005;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const alpha = 0.3 + Math.sin(p.life * Math.PI * 2) * 0.3;
        (ctx as CanvasRenderingContext2D).beginPath();
        (ctx as CanvasRenderingContext2D).arc(p.x, p.y, size, 0, Math.PI * 2);
        (ctx as CanvasRenderingContext2D).fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        (ctx as CanvasRenderingContext2D).fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.15;
            (ctx as CanvasRenderingContext2D).beginPath();
            (ctx as CanvasRenderingContext2D).moveTo(particles[i].x, particles[i].y);
            (ctx as CanvasRenderingContext2D).lineTo(particles[j].x, particles[j].y);
            (ctx as CanvasRenderingContext2D).strokeStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
            (ctx as CanvasRenderingContext2D).lineWidth = 0.5;
            (ctx as CanvasRenderingContext2D).stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, color, speed, size]);

  if (!mounted) return <div className="particle-field-placeholder" />;

  return <canvas ref={canvasRef} className="particle-field" aria-label="Animated particle field background" />;
}
