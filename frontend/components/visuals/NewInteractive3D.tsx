"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Box, Torus, TorusKnot, Icosahedron, Cylinder, Cone, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── Distorted Mesh (Liquid Effect) ─────────────────────────────────────────

function DistortedMesh({ color, position, speed = 1 }: { color: string; position: [number, number, number]; speed?: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      mesh.current.rotation.x += 0.005;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        distort={0.4}
        speed={speed * 2}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

// ── Wireframe Shapes ────────────────────────────────────────────────────────

function WireframeSphere({ color, position }: { color: string; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.02;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial color={color} wireframe />
    </mesh>
  );
}

function WireframeTorusKnot({ color, position }: { color: string; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z += 0.015;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.25;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <torusKnotGeometry args={[1, 0.35, 128, 32]} />
      <meshBasicMaterial color={color} wireframe />
    </mesh>
  );
}

// ── Glowing Orbs ────────────────────────────────────────────────────────────

function GlowingOrb({ color, position, size = 1 }: { color: string; position: [number, number, number]; size?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current && glow.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      glow.current.scale.setScalar(pulse * size);
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.15;
    }
  });

  return (
    <>
      <mesh ref={mesh} position={position}>
        <sphereGeometry args={[size * 0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={glow} position={position}>
        <sphereGeometry args={[size * 0.7, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
}

// ── Floating Particles ──────────────────────────────────────────────────────

function FloatingParticles({ count = 100, color = "#3b82f6" }) {
  const points = useRef<THREE.Points>(null);

  const positions = useRef(
    new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 30)
  );

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.001;
      points.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// ── Morphing Shape ──────────────────────────────────────────────────────────

function MorphingShape({ color, position }: { color: string; position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [shape, setShape] = useState<"sphere" | "box" | "torus">("sphere");

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const changeShape = () => {
    setShape((s) => s === "sphere" ? "box" : s === "box" ? "torus" : "sphere");
  };

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={changeShape}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {shape === "sphere" && <sphereGeometry args={[1, 32, 32]} />}
      {shape === "box" && <boxGeometry args={[1.5, 1.5, 1.5]} />}
      {shape === "torus" && <torusGeometry args={[1, 0.4, 16, 100]} />}
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// ── Main Scene ──────────────────────────────────────────────────────────────

function NewInteractiveScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[10, -10, 10]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#f59e0b" />

      <DistortedMesh color="#3b82f6" position={[-5, 0, 0]} />
      <DistortedMesh color="#ec4899" position={[5, 0.5, 0]} speed={1.5} />
      
      <WireframeSphere color="#22c55e" position={[-3, 2, -2]} />
      <WireframeTorusKnot color="#f59e0b" position={[3, 2, -2]} />
      
      <GlowingOrb color="#8b5cf6" position={[-6, -2, 0]} size={1.2} />
      <GlowingOrb color="#06b6d4" position={[6, -2, 0]} size={0.8} />
      
      <MorphingShape color="#ef4444" position={[0, 0, 0]} />
      
      <FloatingParticles count={150} color="#3b82f6" />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={30}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function NewInteractive3D() {
  return (
    <div className="new-interactive-3d">
      <div className="new-interactive-header">
        <h2>🎮 Interactive 3D Playground</h2>
        <p>Drag to rotate • Scroll to zoom • Click shapes to morph • Fully interactive</p>
      </div>
      
      <Canvas
        className="new-interactive-canvas"
        camera={{ position: [0, 0, 15], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <NewInteractiveScene />
      </Canvas>

      <div className="new-interactive-features">
        <div className="feature-card">
          <div className="feature-icon">🖱️</div>
          <div className="feature-text">
            <h4>Orbit Controls</h4>
            <p>Drag to rotate, scroll to zoom, right-click to pan</p>
          </div>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">✨</div>
          <div className="feature-text">
            <h4>Morphing Shapes</h4>
            <p>Click the red cube to morph between sphere, box, and torus</p>
          </div>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🌊</div>
          <div className="feature-text">
            <h4>Liquid Effects</h4>
            <p>Distorted meshes with organic, flowing animations</p>
          </div>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">💎</div>
          <div className="feature-text">
            <h4>Glowing Orbs</h4>
            <p>Pulsing, emissive spheres with dynamic lighting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
