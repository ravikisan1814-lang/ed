"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ArrowUpRight, Maximize2, RotateCw, ZoomIn } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AnnotationPoint {
  id: string;
  label: string;
  description: string;
  origin: [number, number, number];
  target: [number, number, number];
  color?: string;
}

interface ModelPart {
  id: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  annotations: AnnotationPoint[];
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const SAMPLE_PARTS: ModelPart[] = [
  {
    id: "core",
    position: [0, 0, 0],
    scale: [1.6, 1.6, 1.6],
    color: "#3b82f6",
    annotations: [
      {
        id: "a1",
        label: "Processing Core",
        description: "Main computational unit handling all operations",
        origin: [0.8, 0.8, 0],
        target: [3.5, 2.5, 0],
        color: "#60a5fa",
      },
      {
        id: "a2",
        label: "Memory Bus",
        description: "High-speed data pathway to memory subsystem",
        origin: [0, 0.8, 0.8],
        target: [-3, 3, 2],
        color: "#34d399",
      },
    ],
  },
  {
    id: "module-a",
    position: [-2.8, 0.5, 0],
    scale: [1.0, 1.0, 1.0],
    color: "#8b5cf6",
    annotations: [
      {
        id: "a3",
        label: "Input Module A",
        description: "Primary data ingestion pipeline",
        origin: [0.5, 0.5, 0],
        target: [-5, 2.5, 0],
        color: "#a78bfa",
      },
    ],
  },
  {
    id: "module-b",
    position: [2.8, 0.5, 0],
    scale: [1.0, 1.0, 1.0],
    color: "#f59e0b",
    annotations: [
      {
        id: "a4",
        label: "Output Module B",
        description: "Rendering and output distribution",
        origin: [-0.5, 0.5, 0],
        target: [5, 2.5, 0],
        color: "#fbbf24",
      },
    ],
  },
  {
    id: "base",
    position: [0, -1.4, 0],
    scale: [3.0, 0.4, 1.2],
    color: "#64748b",
    annotations: [
      {
        id: "a5",
        label: "Foundation Base",
        description: "Structural support and power distribution",
        origin: [0, 0.2, 0.6],
        target: [0, -3.5, 2],
        color: "#94a3b8",
      },
    ],
  },
];

// ─── Responsive Camera ───────────────────────────────────────────────────────

function ResponsiveCamera() {
  const { camera } = useThree();
  const prevWidth = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      (camera as any).aspect = width / height;
      camera.updateProjectionMatrix();
      prevWidth.current = width;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [camera]);

  return null;
}

// ─── Animated Part ───────────────────────────────────────────────────────────

function AnimatedPart({
  part,
  isSelected,
  onSelect,
  explodeFactor,
}: {
  part: ModelPart;
  isSelected: boolean;
  onSelect: (id: string) => void;
  explodeFactor: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const basePos = new THREE.Vector3(...part.position);
  const explodeDir = basePos.clone().normalize().multiplyScalar(explodeFactor * 1.5);
  const currentPos = basePos.clone().add(explodeDir);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.position.lerp(currentPos, delta * 4);
    if (isSelected) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[currentPos.x, currentPos.y, currentPos.z]}
        scale={part.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(part.id);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={part.color}
          emissive={isSelected ? part.color : "#000000"}
          emissiveIntensity={isSelected ? 0.4 : 0}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {part.annotations.map((ann) => {
        const originWorld = new THREE.Vector3(
          currentPos.x + ann.origin[0] * part.scale[0],
          currentPos.y + ann.origin[1] * part.scale[1],
          currentPos.z + ann.origin[2] * part.scale[2]
        );
        const targetWorld = new THREE.Vector3(
          currentPos.x + ann.target[0],
          currentPos.y + ann.target[1],
          currentPos.z + ann.target[2]
        );

        return (
          <g key={ann.id}>
            <Line
              points={[originWorld, targetWorld]}
              color={ann.color || part.color}
              lineWidth={isSelected ? 3 : 2}
              dashed
              dashScale={0.1}
              dashSize={0.2}
              gapSize={0.1}
            />
            <Html
              position={[targetWorld.x, targetWorld.y, targetWorld.z]}
              center
              distanceFactor={12}
              style={{
                pointerEvents: "auto",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.92)",
                  border: `1px solid ${ann.color || part.color}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#f1f5f9",
                  fontSize: 13,
                  maxWidth: 200,
                  boxShadow: `0 0 16px ${ann.color || part.color}55`,
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                    fontWeight: 600,
                    color: ann.color || part.color,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  <ArrowUpRight size={13} />
                  {ann.label}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.45 }}>
                  {ann.description}
                </div>
              </div>
            </Html>

            {/* Small dot at origin */}
            <mesh position={[originWorld.x, originWorld.y, originWorld.z]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color={ann.color || part.color} />
            </mesh>
          </g>
        );
      })}
    </group>
  );
}

// ─── Explode / Focus Controls ────────────────────────────────────────────────

function ControlButtons({
  onExplode,
  onReset,
  onZoomIn,
  isExploded,
}: {
  onExplode: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  isExploded: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 10,
        zIndex: 10,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {[
        { icon: <RotateCw size={16} />, label: "Reset", action: onReset },
        { icon: <Maximize2 size={16} />, label: isExploded ? "Collapse" : "Explode", action: onExplode },
        { icon: <ZoomIn size={16} />, label: "Zoom In", action: onZoomIn },
      ].map((btn) => (
        <button
          key={btn.label}
          onClick={btn.action}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            background: "rgba(15, 23, 42, 0.88)",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            borderRadius: 8,
            color: "#e2e8f0",
            fontSize: 13,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(96, 165, 250, 0.7)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(30, 41, 59, 0.95)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(148, 163, 184, 0.3)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(15, 23, 42, 0.88)";
          }}
        >
          {btn.icon}
          {btn.label}
        </button>
      ))}
    </div>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function Scene({
  selectedId,
  onSelect,
  explodeFactor,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  explodeFactor: number;
}) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} castShadow />
      <pointLight position={[-6, 4, -4]} intensity={0.5} color="#60a5fa" />
      <pointLight position={[6, 2, -6]} intensity={0.4} color="#a78bfa" />

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.5}
        scale={14}
        blur={2.5}
        far={4}
        color="#000000"
      />

      {SAMPLE_PARTS.map((part) => (
        <AnimatedPart
          key={part.id}
          part={part}
          isSelected={selectedId === part.id}
          onSelect={onSelect}
          explodeFactor={explodeFactor}
        />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={20}
        autoRotate={selectedId === null}
        autoRotateSpeed={0.6}
      />

      <Environment preset="city" />
    </>
  );
}

// ─── Main Viewer ─────────────────────────────────────────────────────────────

export default function AnnotatedModelViewer({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExplode = useCallback(() => {
    setExplodeFactor((prev) => {
      const next = prev > 0 ? 0 : 1;
      gsap.to({ val: prev }, {
        val: next,
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: function (this: { val: number }) {
          setExplodeFactor(this.val);
        },
      });
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setSelectedId(null);
    setExplodeFactor(0);
  }, []);

  const handleZoomIn = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    gsap.to(el, {
      scale: 1.15,
      duration: 0.5,
      ease: "power2.out",
    });
    setTimeout(() => {
      gsap.to(el, { scale: 1, duration: 0.5, ease: "power2.inOut" });
    }, 500);
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "50vh",
        maxHeight: "80vh",
        borderRadius: 16,
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 3, 10], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: "100%", height: "100%" }}
      >
        <ResponsiveCamera />
        <Scene
          selectedId={selectedId}
          onSelect={setSelectedId}
          explodeFactor={explodeFactor}
        />
      </Canvas>

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(148, 163, 184, 0.25)",
            borderRadius: 8,
            padding: "8px 12px",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>
            3D Model Viewer
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>
            {selectedId
              ? `Selected: ${SAMPLE_PARTS.find((p) => p.id === selectedId)?.id.toUpperCase()}`
              : "Click a part to inspect · Scroll to zoom · Drag to rotate"}
          </div>
        </div>
      </div>

      <ControlButtons
        onExplode={handleExplode}
        onReset={handleReset}
        onZoomIn={handleZoomIn}
        isExploded={explodeFactor > 0}
      />
    </div>
  );
}
