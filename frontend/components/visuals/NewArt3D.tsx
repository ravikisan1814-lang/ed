"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Box, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── Color Palette ───────────────────────────────────────────────────────────

const COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  accent: "#ec4899",
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#06b6d4",
};

// ── Liquid Blob ─────────────────────────────────────────────────────────────

function LiquidBlob({ color, position, scale = 1 }: { color: string; position: [number, number, number]; scale?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [mousePos, setMousePos] = useState([0, 0]);

  useFrame((state) => {
    if (mesh.current) {
      const time = state.clock.elapsedTime;
      mesh.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3;
      mesh.current.rotation.x = Math.sin(time * 0.3) * 0.2;
      mesh.current.rotation.z = Math.cos(time * 0.4) * 0.2;
      
      // Respond to mouse
      const targetX = mousePos[0] * 0.5;
      const targetY = mousePos[1] * 0.5;
      mesh.current.position.x += (targetX - (mesh.current.position.x - position[0])) * 0.05;
    }
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos([x, y]);
  };

  return (
    <mesh
      ref={mesh}
      position={position}
      onPointerMove={handleMouseMove}
    >
      <sphereGeometry args={[scale, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        distort={0.6}
        speed={2}
        roughness={0.1}
        metalness={0.9}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// ── Crystal Shape ───────────────────────────────────────────────────────────

function Crystal({ color, position, scale = 1 }: { color: string; position: [number, number, number]; scale?: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      const time = state.clock.elapsedTime;
      mesh.current.rotation.y = time * 0.5;
      mesh.current.position.y = position[1] + Math.sin(time) * 0.2;
      
      // Pulse effect
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      mesh.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <octahedronGeometry args={[scale, 0]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.1}
        roughness={0.05}
        transmission={0.9}
        thickness={2}
        ior={2.4}
        clearcoat={1}
        clearcoatRoughness={0.1}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// ── Neon Ring ───────────────────────────────────────────────────────────────

function NeonRing({ color, position, radius = 1.5 }: { color: string; position: [number, number, number]; radius?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current && glow.current) {
      mesh.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      mesh.current.rotation.z = state.clock.elapsedTime * 0.3;
      
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      glow.current.scale.setScalar(pulse);
    }
  });

  return (
    <>
      <mesh ref={mesh} position={position}>
        <torusGeometry args={[radius, 0.05, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={glow} position={position}>
        <torusGeometry args={[radius, 0.15, 16, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
}

// ── Particle Field ──────────────────────────────────────────────────────────

function ParticleField({ color = "#3b82f6", count = 200 }: { color?: string; count?: number }) {
  const points = useRef<THREE.Points>(null);
  const velocities = useRef<Float32Array>(new Float32Array(count * 3));

  // Initialize velocities
  for (let i = 0; i < count * 3; i += 3) {
    velocities.current[i] = (Math.random() - 0.5) * 0.02;
    velocities.current[i + 1] = (Math.random() - 0.5) * 0.02;
    velocities.current[i + 2] = (Math.random() - 0.5) * 0.02;
  }

  useFrame((state) => {
    if (points.current) {
      const positions = points.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] += velocities.current[i];
        positions[i + 1] += velocities.current[i + 1];
        positions[i + 2] += velocities.current[i + 2];
        
        // Boundary check
        if (Math.abs(positions[i]) > 10) velocities.current[i] *= -1;
        if (Math.abs(positions[i + 1]) > 10) velocities.current[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 10) velocities.current[i + 2] *= -1;
      }
      
      points.current.geometry.attributes.position.needsUpdate = true;
      points.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 20)), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Main Scene ──────────────────────────────────────────────────────────────

function NewArtScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={1} color={COLORS.accent} />
      <pointLight position={[10, -10, 10]} intensity={1} color={COLORS.info} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color={COLORS.warning} />

      {/* Main liquid blobs */}
      <LiquidBlob color={COLORS.primary} position={[-4, 0, 0]} scale={1.5} />
      <LiquidBlob color={COLORS.secondary} position={[4, 0.5, 0]} scale={1.2} />
      
      {/* Crystals */}
      <Crystal color={COLORS.success} position={[-2, 2, -2]} scale={0.8} />
      <Crystal color={COLORS.warning} position={[2, 2, -2]} scale={0.6} />
      
      {/* Neon rings */}
      <NeonRing color={COLORS.accent} position={[0, 0, -3]} radius={2} />
      <NeonRing color={COLORS.info} position={[0, 0, 3]} radius={1.5} />
      
      {/* Particles */}
      <ParticleField color={COLORS.primary} count={300} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={25}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function NewArt3D() {
  return (
    <div className="new-art-3d">
      <div className="new-art-header">
        <h2>🎨 Interactive Art 3D</h2>
        <p>Move your mouse over the blobs • Click and drag to rotate • Scroll to zoom</p>
      </div>
      
      <Canvas
        className="new-art-canvas"
        camera={{ position: [0, 0, 12], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <NewArtScene />
      </Canvas>

      <div className="new-art-stats">
        <div className="stat-item">
          <span className="stat-value">2</span>
          <span className="stat-label">Liquid Blobs</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">2</span>
          <span className="stat-label">Crystals</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">2</span>
          <span className="stat-label">Neon Rings</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">300</span>
          <span className="stat-label">Particles</span>
        </div>
      </div>
    </div>
  );
}
