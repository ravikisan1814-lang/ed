"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
  className?: string;
}

export default function ParticleField({ count = 200, color = "#60a5fa", speed = 1, size = 0.05, className }: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let cleanupFn: (() => void) | null = null;

    async function init() {
      try {
        const THREE = await import("three");
        if (cancelled || !container || container.clientWidth === 0) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorObj = new THREE.Color(color);

        for (let i = 0; i < count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 10;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

          colors[i * 3] = colorObj.r;
          colors[i * 3 + 1] = colorObj.g;
          colors[i * 3 + 2] = colorObj.b;
        }

        particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
        });

        const particleSystem = new THREE.Points(particles, material);
        scene.add(particleSystem);

        const resize = () => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          if (w === 0 || h === 0) return;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        const observer = new ResizeObserver(resize);
        observer.observe(container);

        const clock = new THREE.Clock();
        const animate = () => {
          animFrameRef.current = requestAnimationFrame(animate);
          const t = clock.getElapsedTime() * speed;
          particleSystem.rotation.y = t * 0.1;
          particleSystem.rotation.x = Math.sin(t * 0.05) * 0.1;
          renderer.render(scene, camera);
        };
        animate();

        cleanupFn = () => {
          cancelAnimationFrame(animFrameRef.current);
          observer.disconnect();
          renderer.dispose();
          particles.dispose();
          material.dispose();
          if (renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
          }
        };
      } catch (err) {
        console.error("ParticleField initialization failed:", err);
        if (!cancelled && containerRef.current) {
          containerRef.current.textContent = "Particle visualization failed to load.";
          containerRef.current.setAttribute("role", "alert");
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      cleanupFn?.();
    };
  }, [count, color, speed, size]);

  return (
    <div
      ref={containerRef}
      className={className ?? "three-scene"}
      aria-label="Animated particle field visualization"
      role="img"
      tabIndex={0}
    />
  );
}
