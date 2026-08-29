"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";

interface GeometricMorphProps {
  type?: "cube" | "sphere" | "torus" | "icosahedron";
  morphSpeed?: number;
}

export default function GeometricMorph({ type = "torus", morphSpeed = 1 }: GeometricMorphProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");
      if (cancelled || !mount) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const pointLight = new THREE.PointLight(0x60a5fa, 1.5);
      pointLight.position.set(3, 3, 3);
      scene.add(pointLight);

      // Create morphing geometry
      const geometries = [
        new THREE.TorusGeometry(1.2, 0.4, 32, 64),
        new THREE.SphereGeometry(1.2, 32, 32),
        new THREE.BoxGeometry(1.6, 1.6, 1.6),
        new THREE.IcosahedronGeometry(1.2, 1),
      ];

      const geoIndices: Record<string, number[]> = {
        torus: [0, 1],
        sphere: [1, 2],
        cube: [2, 3],
        icosahedron: [3, 0],
      };
      const [fromIdx, toIdx] = geoIndices[type] ?? [0, 1];
      const fromGeo = geometries[fromIdx];
      const toGeo = geometries[toIdx];

      const material = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.4,
        roughness: 0.3,
        wireframe: false,
        emissive: 0x1e3a8a,
        emissiveIntensity: 0.2,
      });
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });

      const mesh = new THREE.Mesh(fromGeo.clone(), material);
      const wireMesh = new THREE.Mesh(fromGeo.clone(), wireMat);
      mesh.add(wireMesh);
      scene.add(mesh);

      const clock = new THREE.Clock();
      let frame = 0;

      function animate() {
        frame = requestAnimationFrame(animate);
        const t = clock.getElapsedTime() * morphSpeed;

        // Morph between geometries using interpolation
        const morphT = (Math.sin(t * 0.5) + 1) / 2; // 0 to 1 oscillating
        const positions1 = fromGeo.attributes.position.array as Float32Array;
        const positions2 = toGeo.attributes.position.array as Float32Array;
        const meshPositions = mesh.geometry.attributes.position.array as Float32Array;
        const wirePositions = wireMesh.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < positions1.length; i++) {
          meshPositions[i] = positions1[i] * (1 - morphT) + positions2[i] * morphT;
          wirePositions[i] = meshPositions[i];
        }
        mesh.geometry.attributes.position.needsUpdate = true;
        wireMesh.geometry.attributes.position.needsUpdate = true;

        mesh.rotation.y = t * 0.3;
        mesh.rotation.x = Math.sin(t * 0.2) * 0.3;
        wireMesh.rotation.copy(mesh.rotation);

        renderer.render(scene, camera);
      }
      animate();

      const resize = () => {
        if (!mount) return;
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", resize);

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        renderer.dispose();
        fromGeo.dispose();
        toGeo.dispose();
        material.dispose();
        wireMat.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    })().catch(() => {});

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [type, morphSpeed]);

  return <div ref={mountRef} className="geometric-morph" />;
}
