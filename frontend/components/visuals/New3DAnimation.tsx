"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Box, Torus, TorusKnot, Icosahedron, Cylinder, Cone } from "@react-three/drei";
import * as THREE from "three";

// ── Interactive 3D Objects ──────────────────────────────────────────────────

function AnimatedSphere({ color, position }: { color: string; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Sphere
      ref={mesh}
      args={[1, 32, 32]}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      material-color={hovered ? "#fff" : color}
      material-emissive={color}
      material-emissiveIntensity={hovered ? 0.5 : 0.2}
    />
  );
}

function AnimatedBox({ color, position }: { color: string; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.02;
      mesh.current.rotation.y += 0.02;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Box
      ref={mesh}
      args={[1.5, 1.5, 1.5]}
      position={position}
      material-color={color}
      material-metalness={0.3}
      material-roughness={0.4}
    />
  );
}

function AnimatedTorus({ color, position }: { color: string; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.015;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.15;
    }
  });

  return (
    <Torus
      ref={mesh}
      args={[1, 0.4, 16, 100]}
      position={position}
      material-color={color}
      material-emissive={color}
      material-emissiveIntensity={0.3}
    />
  );
}

function AnimatedTorusKnot({ color, position }: { color: string; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z += 0.01;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <TorusKnot
      ref={mesh}
      args={[1, 0.35, 128, 32]}
      position={position}
      material-color={color}
      material-metalness={0.8}
      material-roughness={0.2}
    />
  );
}

function AnimatedIcosahedron({ color, position }: { color: string; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.015;
      mesh.current.rotation.y += 0.01;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.25;
    }
  });

  return (
    <Icosahedron
      ref={mesh}
      args={[1.2, 0]}
      position={position}
      material-color={color}
      material-wireframe
    />
  );
}

function AnimatedCylinder({ color, position }: { color: string; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z += 0.02;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.15;
    }
  });

  return (
    <Cylinder
      ref={mesh}
      args={[0.8, 0.8, 2, 32]}
      position={position}
      material-color={color}
      material-metalness={0.5}
      material-roughness={0.3}
    />
  );
}

function AnimatedCone({ color, position }: { color: string; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.015;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.2;
    }
  });

  return (
    <Cone
      ref={mesh}
      args={[1, 2, 32]}
      position={position}
      material-color={color}
      material-emissive={color}
      material-emissiveIntensity={0.2}
    />
  );
}

// ── Scene Component ─────────────────────────────────────────────────────────

function InteractiveScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#06b6d4" />

      <AnimatedSphere color="#3b82f6" position={[-4, 0, 0]} />
      <AnimatedBox color="#ef4444" position={[-2, 0.5, 0]} />
      <AnimatedTorus color="#22c55e" position={[0, 0, 0]} />
      <AnimatedTorusKnot color="#f59e0b" position={[2, 0.3, 0]} />
      <AnimatedIcosahedron color="#ec4899" position={[4, 0, 0]} />
      <AnimatedCylinder color="#8b5cf6" position={[-3, -2, 0]} />
      <AnimatedCone color="#06b6d4" position={[3, -2, 0]} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={20}
      />
    </>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function New3DAnimation() {
  return (
    <div className="new-3d-container">
      <div className="new-3d-header">
        <h2>Interactive 3D Shapes</h2>
        <p>Drag to rotate • Scroll to zoom • Click objects to highlight</p>
      </div>
      <Canvas
        className="new-3d-canvas"
        camera={{ position: [0, 0, 12], fov: 75 }}
        shadows
      >
        <InteractiveScene />
      </Canvas>
      <div className="new-3d-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#3b82f6" }} />
          <span>Sphere</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#ef4444" }} />
          <span>Box</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#22c55e" }} />
          <span>Torus</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#f59e0b" }} />
          <span>Torus Knot</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#ec4899" }} />
          <span>Icosahedron</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#8b5cf6" }} />
          <span>Cylinder</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#06b6d4" }} />
          <span>Cone</span>
        </div>
      </div>
    </div>
  );
}
