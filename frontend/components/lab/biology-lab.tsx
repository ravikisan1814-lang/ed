"use client";

import { useState, useEffect, useRef } from "react";
import ErrorBoundary from "../ErrorBoundary";
import { LabCard, MeaningPanel } from "./ui";

// ─── DNA Double Helix ───────────────────────────────────────────────────────

function DNALab({ className }: { className?: string }) {
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
        const radius = 1.5;
        const colors = [0x3b82f6, 0xef4444, 0x22c55e, 0xf59e0b];

        for (let i = 0; i < basePairs; i++) {
          const t = i / basePairs;
          const angle = t * Math.PI * 8;
          const y = (t - 0.5) * 6;

          const strand1X = Math.cos(angle) * radius;
          const strand1Z = Math.sin(angle) * radius;
          const strand2X = Math.cos(angle + Math.PI) * radius;
          const strand2Z = Math.sin(angle + Math.PI) * radius;

          const pairColor = colors[i % colors.length];
          const rungGeo = new THREE.CylinderGeometry(0.05, 0.05, radius * 2, 8);
          const rungMat = new THREE.MeshStandardMaterial({ color: pairColor });
          const rung = new THREE.Mesh(rungGeo, rungMat);
          rung.position.set(0, y, 0);
          rung.rotation.z = Math.PI / 2;
          rung.rotation.y = angle;
          scene.add(rung);

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

// ─── Cell 3D ─────────────────────────────────────────────────────────────────

function Cell3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const [cellType, setCellType] = useState<"animal" | "plant">("animal");

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
        camera.position.set(0, 0, 6);

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

        // Cell membrane (outer boundary)
        const membraneGeo = new THREE.SphereGeometry(2, 32, 32);
        const membraneMat = new THREE.MeshStandardMaterial({
          color: cellType === "plant" ? 0x22c55e : 0x3b82f6,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide
        });
        const membrane = new THREE.Mesh(membraneGeo, membraneMat);
        scene.add(membrane);

        // Nucleus
        const nucleusGeo = new THREE.SphereGeometry(0.6, 32, 32);
        const nucleusMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.2 });
        const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
        nucleus.position.set(0.3, 0.2, 0);
        scene.add(nucleus);

        // Mitochondria (multiple)
        for (let i = 0; i < 5; i++) {
          const mitoGeo = new THREE.CapsuleGeometry(0.15, 0.4, 8, 16);
          const mitoMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
          const mito = new THREE.Mesh(mitoGeo, mitoMat);
          const angle = (i / 5) * Math.PI * 2;
          mito.position.set(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0);
          mito.rotation.z = angle;
          scene.add(mito);
        }

        // ER (endoplasmic reticulum) - torus shapes
        for (let i = 0; i < 3; i++) {
          const erGeo = new THREE.TorusGeometry(0.4 + i * 0.15, 0.05, 8, 32);
          const erMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
          const er = new THREE.Mesh(erGeo, erMat);
          er.position.set(0, 0, -0.5 + i * 0.3);
          scene.add(er);
        }

        // Plant cell wall (extra layer for plant)
        if (cellType === "plant") {
          const wallGeo = new THREE.BoxGeometry(4.5, 4.5, 4.5);
          const wallMat = new THREE.MeshStandardMaterial({
            color: 0x22c55e,
            transparent: true,
            opacity: 0.15,
            wireframe: true
          });
          const wall = new THREE.Mesh(wallGeo, wallMat);
          scene.add(wall);

          // Large central vacuole
          const vacuoleGeo = new THREE.SphereGeometry(1.2, 32, 32);
          const vacuoleMat = new THREE.MeshStandardMaterial({
            color: 0x60a5fa,
            transparent: true,
            opacity: 0.4
          });
          const vacuole = new THREE.Mesh(vacuoleGeo, vacuoleMat);
          vacuole.position.set(-0.5, -0.3, 0);
          scene.add(vacuole);
        }

        // Chloroplasts for plant cell
        if (cellType === "plant") {
          for (let i = 0; i < 4; i++) {
            const chloroGeo = new THREE.SphereGeometry(0.25, 16, 16);
            const chloroMat = new THREE.MeshStandardMaterial({ color: 0x16a34a });
            const chloro = new THREE.Mesh(chloroGeo, chloroMat);
            const angle = (i / 4) * Math.PI * 2;
            chloro.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0.5);
            scene.add(chloro);
          }
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
          scene.rotation.y = t * 0.1;
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
        console.error("Cell3D initialization failed:", err);
      }
    }

    init();

    return () => {
      cancelled = true;
      cleanupFn?.();
    };
  }, [cellType]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setCellType("animal")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            cellType === "animal"
              ? "bg-blue-500 text-white"
              : "bg-card border border-border text-muted-foreground hover:border-blue-500/50"
          }`}
        >
          Animal Cell
        </button>
        <button
          onClick={() => setCellType("plant")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            cellType === "plant"
              ? "bg-green-500 text-white"
              : "bg-card border border-border text-muted-foreground hover:border-green-500/50"
          }`}
        >
          Plant Cell
        </button>
      </div>
      <div ref={containerRef} className="lab-3d-container" />
      <MeaningPanel
        title={cellType === "plant" ? "Plant Cell Structure" : "Animal Cell Structure"}
        meaning={
          cellType === "plant"
            ? "Plant cells have a rigid cell wall, large central vacuole, and chloroplasts for photosynthesis."
            : "Animal cells lack cell walls and chloroplasts but have centrioles and lysosomes."
        }
        points={[
          "Nucleus: contains genetic material (DNA)",
          "Mitochondria: powerhouses of the cell",
          cellType === "plant" ? "Cell wall: provides structural support" : "Centrioles: help in cell division",
          cellType === "plant" ? "Chloroplasts: site of photosynthesis" : "Lysosomes: contain digestive enzymes",
          cellType === "plant" ? "Large vacuole: stores water and nutrients" : "Small vacuoles: storage and transport",
        ]}
        color={cellType === "plant" ? "green" : "blue"}
      />
    </div>
  );
}

// ─── Neuron 3D ───────────────────────────────────────────────────────────────

function Neuron3D() {
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
        camera.position.set(0, 2, 8);

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

        // Cell body (soma)
        const somaGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const somaMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.1 });
        const soma = new THREE.Mesh(somaGeo, somaMat);
        scene.add(soma);

        // Dendrites (branching structures)
        const dendriteColors = [0xef4444, 0x3b82f6, 0x22c55e, 0xa855f7, 0xf97316];
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const dendriteGeo = new THREE.CylinderGeometry(0.03, 0.08, 1.5, 8);
          const dendriteMat = new THREE.MeshStandardMaterial({ color: dendriteColors[i % dendriteColors.length] });
          const dendrite = new THREE.Mesh(dendriteGeo, dendriteMat);
          dendrite.position.set(
            Math.cos(angle) * 1.2,
            Math.sin(angle) * 0.5,
            0
          );
          dendrite.rotation.z = angle * 0.5;
          dendrite.rotation.y = angle;
          scene.add(dendrite);
        }

        // Axon (long projection)
        const axonGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
        const axonMat = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
        const axon = new THREE.Mesh(axonGeo, axonMat);
        axon.position.set(0, -2.5, 0);
        scene.add(axon);

        // Myelin sheath (segments along axon)
        for (let i = 0; i < 5; i++) {
          const myelinGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
          const myelinMat = new THREE.MeshStandardMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.7 });
          const myelin = new THREE.Mesh(myelinGeo, myelinMat);
          myelin.position.set(0, -1.8 - i * 0.7, 0);
          scene.add(myelin);
        }

        // Axon terminals (branching at end)
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const terminalGeo = new THREE.SphereGeometry(0.12, 16, 16);
          const terminalMat = new THREE.MeshStandardMaterial({ color: 0xec4899 });
          const terminal = new THREE.Mesh(terminalGeo, terminalMat);
          terminal.position.set(
            Math.cos(angle) * 0.5,
            -5.2,
            Math.sin(angle) * 0.5
          );
          scene.add(terminal);
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
          scene.rotation.y = t * 0.15;
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
        console.error("Neuron3D initialization failed:", err);
      }
    }

    init();

    return () => {
      cancelled = true;
      cleanupFn?.();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="lab-3d-container" />
      <MeaningPanel
        title="Neuron Structure"
        meaning="Neurons are the basic units of the nervous system. They transmit electrical and chemical signals throughout the body."
        points={[
          "Dendrites: receive signals from other neurons",
          "Cell body (soma): contains nucleus and organelles",
          "Axon: transmits signals away from cell body",
          "Myelin sheath: insulates axon for faster signal transmission",
          "Axon terminals: release neurotransmitters to synapse",
        ]}
        color="purple"
      />
    </div>
  );
}

export default function BiologyLab() {
  const [activeSim, setActiveSim] = useState<"dna" | "cell" | "neuron">("dna");

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Biology Lab</h2>
        <p className="text-sm text-muted-foreground">Interactive 3D models of biological structures.</p>
      </div>

      {/* Simulation selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "dna", label: "DNA Double Helix" },
          { key: "cell", label: "Cell Structure" },
          { key: "neuron", label: "Neuron" },
        ].map((sim) => (
          <button
            key={sim.key}
            onClick={() => setActiveSim(sim.key as "dna" | "cell" | "neuron")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSim === sim.key
                ? "bg-green-500 text-white"
                : "bg-card border border-border text-muted-foreground hover:border-green-500/50"
            }`}
          >
            {sim.label}
          </button>
        ))}
      </div>

      {activeSim === "dna" && (
        <LabCard title="DNA Double Helix" subtitle="Deoxyribonucleic Acid">
          <DNALab />
          <MeaningPanel
            title="DNA Structure"
            meaning="DNA is a double helix made of two strands of nucleotides. Each nucleotide contains a sugar, phosphate, and nitrogenous base."
            points={[
              "Base pairs: Adenine-Thymine (A-T), Guanine-Cytosine (G-C)",
              "Runs antiparallel (5' to 3' and 3' to 5')",
              "Replication is semi-conservative",
              "Encodes genetic information for protein synthesis",
            ]}
            color="blue"
          />
        </LabCard>
      )}

      {activeSim === "cell" && (
        <LabCard title="Cell Structure" subtitle="Basic unit of life">
          <Cell3D />
        </LabCard>
      )}

      {activeSim === "neuron" && (
        <LabCard title="Neuron" subtitle="Nervous system cell">
          <Neuron3D />
          <MeaningPanel
            title="Neuron Function"
            meaning="Neurons communicate via electrical impulses (action potentials) and chemical signals (neurotransmitters) across synapses."
            points={[
              "Resting potential: -70mV",
              "Action potential: +40mV peak",
              "Synaptic transmission via neurotransmitters",
              "Myelin increases conduction velocity",
            ]}
            color="purple"
          />
        </LabCard>
      )}
    </div>
  );
}
