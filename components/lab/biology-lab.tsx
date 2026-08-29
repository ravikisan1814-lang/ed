"use client";

import { useState, useEffect, useRef } from "react";
import ErrorBoundary from "../ErrorBoundary";

interface DNALabProps {
  className?: string;
}

function DNALab({ className }: DNALabProps) {
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
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        if (cancelled || !container || container.clientWidth === 0) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a);

        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambient);
        const directional = new THREE.DirectionalLight(0xffffff, 0.8);
        directional.position.set(5, 5, 5);
        scene.add(directional);

        // DNA Double Helix
        const basePairs = 20;
        const twist = 0.5;
        const radius = 1.5;
        const colors = [0x3b82f6, 0xef4444, 0x22c55e, 0xf59e0b];

        for (let i = 0; i < basePairs; i++) {
          const t = i / basePairs;
          const angle = t * Math.PI * 8;
          const y = (t - 0.5) * 6;

          // Backbone strands
          const strand1X = Math.cos(angle) * radius;
          const strand1Z = Math.sin(angle) * radius;
          const strand2X = Math.cos(angle + Math.PI) * radius;
          const strand2Z = Math.sin(angle + Math.PI) * radius;

          // Base pair (rungs)
          const pairColor = colors[i % colors.length];
          const rungGeo = new THREE.CylinderGeometry(0.05, 0.05, radius * 2, 8);
          const rungMat = new THREE.MeshStandardMaterial({ color: pairColor });
          const rung = new THREE.Mesh(rungGeo, rungMat);
          rung.position.set(0, y, 0);
          rung.rotation.z = Math.PI / 2;
          rung.rotation.y = angle;
          scene.add(rung);

          // Nucleotide spheres
          const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
          const sphereMat = new THREE.MeshStandardMaterial({ color: pairColor });

          const sphere1 = new THREE.Mesh(sphereGeo, sphereMat);
          sphere1.position.set(strand1X, y, strand1Z);
          scene.add(sphere1);

          const sphere2 = new THREE.Mesh(sphereGeo, sphereMat.clone());
          sphere2.position.set(strand2X, y, strand2Z);
          scene.add(sphere2);
        }

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
          const t = clock.getElapsedTime();
          scene.rotation.y = t * 0.2;
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        cleanupFn = () => {
          cancelAnimationFrame(animFrameRef.current);
          observer.disconnect();
          controls.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
          }
        };
      } catch (err) {
        console.error("DNALab initialization failed:", err);
        if (!cancelled && containerRef.current) {
          containerRef.current.textContent = "3D visualization failed to load.";
          containerRef.current.setAttribute("role", "alert");
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      cleanupFn?.();
    };
  }, []);

  return (
    <ErrorBoundary
      fallback={
        <div role="alert" aria-live="assertive" className="under-development">
          <span className="ud-icon" aria-hidden="true">⚠️</span>
          3D visualization unavailable
        </div>
      }
    >
      <div
        ref={containerRef}
        className={className ?? "lab-3d-container"}
        aria-label="Interactive DNA double helix model - drag to rotate"
        role="img"
        tabIndex={0}
      />
    </ErrorBoundary>
  );
}

export default DNALab;
