"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";

interface GeometricMorphProps {
  type?: "cube" | "sphere" | "torus" | "icosahedron";
  morphSpeed?: number;
  className?: string;
}

export default function GeometricMorph({ type = "cube", morphSpeed = 1, className }: GeometricMorphProps) {
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

        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);
        const directional = new THREE.DirectionalLight(0xffffff, 0.8);
        directional.position.set(5, 5, 5);
        scene.add(directional);

        let mesh: THREE.Mesh;
        const material = new THREE.MeshStandardMaterial({
          color: 0x3b82f6,
          metalness: 0.3,
          roughness: 0.4,
          wireframe: false,
        });

        switch (type) {
          case "cube":
            mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), material);
            break;
          case "sphere":
            mesh = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), material);
            break;
          case "torus":
            mesh = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.4, 16, 100), material);
            break;
          case "icosahedron":
            mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 0), material);
            break;
          default:
            mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), material);
        }

        scene.add(mesh);

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
          const t = clock.getElapsedTime() * morphSpeed;
          mesh.rotation.x = t * 0.5;
          mesh.rotation.y = t * 0.3;
          renderer.render(scene, camera);
        };
        animate();

        cleanupFn = () => {
          cancelAnimationFrame(animFrameRef.current);
          observer.disconnect();
          renderer.dispose();
          if (renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
          }
        };
      } catch (err) {
        console.error("GeometricMorph initialization failed:", err);
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
  }, [type, morphSpeed]);

  return (
    <div
      ref={containerRef}
      className={className ?? "three-scene"}
      aria-label={`Interactive ${type} visualization - drag to rotate`}
      role="img"
      tabIndex={0}
    />
  );
}
