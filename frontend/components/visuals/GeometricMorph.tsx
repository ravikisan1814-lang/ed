"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type MorphType = "sphere" | "torus" | "cube" | "icosahedron";

interface GeometricMorphProps {
  type?: MorphType;
  morphSpeed?: number;
  color?: string;
  className?: string;
}

export default function GeometricMorph({ 
  type = "torus", 
  morphSpeed = 1,
  color = "#8b5cf6",
  className = "" 
}: GeometricMorphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
    const material = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.7,
      roughness: 0.2,
      transmission: 0.3,
      thickness: 2,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(color, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (mesh) {
        mesh.rotation.x += 0.01 * morphSpeed;
        mesh.rotation.y += 0.015 * morphSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (container && camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (renderer) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      if (geometry) geometry.dispose();
      if (material) material.dispose();
    };
  }, [color, morphSpeed]);

  return (
    <div ref={containerRef} className={`geometric-morph-container ${className}`} />
  );
}
