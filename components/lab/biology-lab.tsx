"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MeaningPanel, LabCard, ResultBadge } from "./ui";

// ─── DNA Double Helix ───────────────────────────────────────────────────────

function DNALab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let cleanupFn: (() => void) | null = null;

    const run = async () => {
      if (cancelled) return;
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (!container || container.clientWidth === 0) return;
      const rect = container.getBoundingClientRect();

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a1a);

      const camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 100);
      camera.position.set(0, 0, 10);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(5, 5, 5);
      scene.add(dir);
      const point = new THREE.PointLight(0x4488ff, 0.5);
      point.position.set(-5, 3, 5);
      scene.add(point);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.0;

      const radius = 1.5;
      const height = 5;
      const turns = 3;
      const totalPoints = 200;
      const pointsA: THREE.Vector3[] = [];
      const pointsB: THREE.Vector3[] = [];
      const basePairs: Array<{ a: THREE.Vector3; b: THREE.Vector3; colorA: number; colorB: number }> = [];

      const basePairsList: Array<[string, string]> = [["A", "T"], ["T", "A"], ["G", "C"], ["C", "G"]];
      const baseColorMap: Record<string, number> = { A: 0xff4444, T: 0x4488ff, G: 0x44cc44, C: 0xffee44 };

      for (let i = 0; i <= totalPoints; i++) {
        const t = (i / totalPoints) * Math.PI * 2 * turns;
        const y = (i / totalPoints) * height - height / 2;
        const xA = Math.cos(t) * radius;
        const zA = Math.sin(t) * radius;
        const xB = Math.cos(t + Math.PI) * radius;
        const zB = Math.sin(t + Math.PI) * radius;
        pointsA.push(new THREE.Vector3(xA, y, zA));
        pointsB.push(new THREE.Vector3(xB, y, zB));
        if (i % 10 === 0 && i < totalPoints) {
          const pair = basePairsList[Math.floor(Math.random() * basePairsList.length)];
          basePairs.push({
            a: new THREE.Vector3(xA, y, zA),
            b: new THREE.Vector3(xB, y, zB),
            colorA: baseColorMap[pair[0]],
            colorB: baseColorMap[pair[1]],
          });
        }
      }

      const lineMat = new THREE.LineBasicMaterial({ color: 0xaaaaaa, linewidth: 2 });
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pointsA), lineMat));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pointsB), lineMat));

      const sphereGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const backboneMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4 });
      for (const p of pointsA) {
        const m = new THREE.Mesh(sphereGeo, backboneMat);
        m.position.copy(p);
        scene.add(m);
      }
      for (const p of pointsB) {
        const m = new THREE.Mesh(sphereGeo, backboneMat);
        m.position.copy(p);
        scene.add(m);
      }

      for (const pair of basePairs) {
        const dir = new THREE.Vector3().subVectors(pair.b, pair.a);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(pair.a, pair.b).multiplyScalar(0.5);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        const cylGeo = new THREE.CylinderGeometry(0.06, 0.06, len, 8);
        const cyl1 = new THREE.Mesh(cylGeo, new THREE.MeshStandardMaterial({ color: pair.colorA }));
        const cyl2 = new THREE.Mesh(cylGeo.clone(), new THREE.MeshStandardMaterial({ color: pair.colorB }));
        cyl1.position.copy(pair.a);
        cyl1.quaternion.copy(quat);
        cyl2.position.copy(mid);
        cyl2.quaternion.copy(quat);
        cyl2.translateY(len / 2);
        scene.add(cyl1);
        scene.add(cyl2);
        const endGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const endA = new THREE.Mesh(endGeo, new THREE.MeshStandardMaterial({ color: pair.colorA }));
        const endB = new THREE.Mesh(endGeo.clone(), new THREE.MeshStandardMaterial({ color: pair.colorB }));
        endA.position.copy(pair.a);
        endB.position.copy(pair.b);
        scene.add(endA);
        scene.add(endB);
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

      const animate = () => {
        animFrameRef.current = requestAnimationFrame(animate);
        if (cancelled) return;
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelled = true;
        cancelAnimationFrame(animFrameRef.current);
        observer.disconnect();
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
      };
    };

    void run();
    return () => { cancelled = true; cleanupFn?.(); };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }}
      className="rounded-lg overflow-hidden border border-border"
    />
  );
}

// ─── 3D Cell Visualization ──────────────────────────────────────────────────

function CellLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const [cellType, setCellType] = useState<"animal" | "plant">("animal");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let cleanupFn: (() => void) | null = null;

    const run = async () => {
      if (cancelled) return;
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (!container || container.clientWidth === 0) return;
      const rect = container.getBoundingClientRect();

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(cellType === "animal" ? 0x0a1a2a : 0x0a1a0a);

      const camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 100);
      camera.position.set(0, 0, 8);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(5, 5, 5);
      scene.add(dir);
      const fill = new THREE.PointLight(cellType === "animal" ? 0x88ccff : 0x88ff88, 0.4);
      fill.position.set(-5, -3, 3);
      scene.add(fill);

      const group = new THREE.Group();

      if (cellType === "animal") {
        group.add(new THREE.Mesh(
          new THREE.SphereGeometry(3, 32, 32),
          new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transparent: true, opacity: 0.25, roughness: 0.2, side: THREE.DoubleSide }),
        ));
        const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), new THREE.MeshStandardMaterial({ color: 0x9944cc, roughness: 0.5 }));
        group.add(nucleus);
        const nucleolus = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshStandardMaterial({ color: 0x6622aa }));
        nucleolus.position.set(0.2, 0.2, 0.3);
        nucleus.add(nucleolus);
        const matMito = new THREE.MeshStandardMaterial({ color: 0xff8844, roughness: 0.6 });
        for (const [x, y, z] of [[1.5, 0.8, 0.5], [-1.2, -0.6, 1.0], [0.8, -1.2, -0.8], [-1.6, 0.4, -0.6], [0.3, 1.4, 0.6]]) {
          const m = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), matMito);
          m.scale.set(1, 0.6, 1);
          m.position.set(x, y, z);
          group.add(m);
        }
        const matGolgi = new THREE.MeshStandardMaterial({ color: 0xffcc44, roughness: 0.5 });
        for (const [x, y, z] of [[1.8, 0.5, -0.5], [-1.5, -0.3, 1.2]]) {
          for (let i = 0; i < 5; i++) {
            const flap = new THREE.Mesh(new THREE.TorusGeometry(0.35 - i * 0.04, 0.06, 8, 16, Math.PI * 1.2), matGolgi);
            flap.position.set(x, y + i * 0.18, z);
            flap.rotation.x = Math.PI / 2;
            flap.rotation.z = i * 0.2;
            group.add(flap);
          }
        }
      } else {
        group.add(new THREE.Mesh(
          new THREE.BoxGeometry(6, 4.5, 3),
          new THREE.MeshStandardMaterial({ color: 0x44aa44, transparent: true, opacity: 0.3, side: THREE.DoubleSide }),
        ));
        group.add(new THREE.Mesh(
          new THREE.BoxGeometry(5.6, 4.1, 2.6),
          new THREE.MeshPhysicalMaterial({ color: 0x88dd88, transparent: true, opacity: 0.2, roughness: 0.2 }),
        ));
        const vacuole = new THREE.Mesh(
          new THREE.SphereGeometry(1.6, 32, 32),
          new THREE.MeshPhysicalMaterial({ color: 0xaaddff, transparent: true, opacity: 0.4, roughness: 0.1 }),
        );
        vacuole.scale.set(1, 1.3, 0.7);
        group.add(vacuole);
        const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), new THREE.MeshStandardMaterial({ color: 0x9944cc, roughness: 0.5 }));
        nucleus.position.set(2.0, 0.5, 0);
        group.add(nucleus);
        const matChloro = new THREE.MeshStandardMaterial({ color: 0x22aa22, roughness: 0.6 });
        for (const [x, y, z] of [[2.2, 1.3, 0.8], [2.2, -1.0, -0.8], [-2.0, 1.2, 0.6], [-2.0, -1.3, -0.6], [0, 1.8, 1.0], [0, -1.8, -1.0]]) {
          const c = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), matChloro);
          c.scale.set(1.4, 0.7, 0.8);
          c.position.set(x, y, z);
          group.add(c);
        }
      }

      scene.add(group);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = cellType === "animal" ? 0.8 : 0.6;

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

      const animate = () => {
        animFrameRef.current = requestAnimationFrame(animate);
        if (cancelled) return;
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelled = true;
        cancelAnimationFrame(animFrameRef.current);
        observer.disconnect();
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
      };
    };

    void run();
    return () => { cancelled = true; cleanupFn?.(); };
  }, [cellType]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="flex-1">
        <div
          ref={containerRef}
          style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }}
          className="rounded-lg overflow-hidden border border-border"
        />
      </div>
      <div className="w-full sm:w-52 flex flex-col gap-3">
        <select
          value={cellType}
          onChange={(e) => setCellType(e.target.value as "animal" | "plant")}
          className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="animal">Animal Cell</option>
          <option value="plant">Plant Cell</option>
        </select>
        {cellType === "animal" ? (
          <>
            <MeaningPanel title="Cell Membrane" meaning="Semi-permeable lipid bilayer controlling substance entry/exit." points={["Phospholipid bilayer", "Selective permeability", "Fluid mosaic model"]} color="blue" />
            <MeaningPanel title="Golgi Bodies" meaning="Stacks of membranes that modify, sort, and package proteins." points={["Also called Golgi apparatus", "Produces lysosomes", "Secretory pathway"]} color="amber" />
            <MeaningPanel title="Centrioles" meaning="Cylindrical structures involved in cell division (animal cells only)." points={["Form spindle fibers", "Only in animal cells", "Pair called centrosome"]} color="rose" />
          </>
        ) : (
          <>
            <MeaningPanel title="Cell Wall" meaning="Rigid outer layer of cellulose providing structural support." points={["Made of cellulose", "Provides turgor pressure", "Only in plant cells"]} color="green" />
            <MeaningPanel title="Central Vacuole" meaning="Large storage compartment maintaining turgor pressure." points={["Can occupy 90% of cell", "Stores water and ions", "Maintains cell rigidity"]} color="cyan" />
            <MeaningPanel title="Chloroplasts" meaning="Green organelles containing chlorophyll for photosynthesis." points={["Site of photosynthesis", "Contain thylakoids", "Only in plant cells"]} color="green" />
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function BiologyLab() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Biology Lab</h2>
        <p className="text-sm text-muted-foreground">Interactive 3D models of cellular structures and genetic material.</p>
      </div>

      <LabCard title="DNA Double Helix" subtitle="Interactive 3D model - drag to rotate, scroll to zoom">
        <DNALab />
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="text-muted-foreground">A-T (red-blue)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <span className="text-muted-foreground">G-C (green-yellow)</span>
          </div>
          <span className="text-muted-foreground">Grey spheres = sugar-phosphate backbone</span>
        </div>
        <div className="mt-3">
          <MeaningPanel
            title="DNA Double Helix"
            meaning="Deoxyribonucleic acid is a double-stranded helical molecule that carries genetic information. Base pairs A-T and G-C hold the two strands together via hydrogen bonds."
            points={["A pairs with T (2 hydrogen bonds)", "G pairs with C (3 hydrogen bonds)", "Sugar-phosphate backbone forms the rails", "Encoded in nucleus of eukaryotic cells"]}
            color="purple"
          />
        </div>
      </LabCard>

      <LabCard title="Cell Structure" subtitle="Compare animal and plant cells in 3D">
        <CellLab />
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <ResultBadge label="DNA Location" value="Nucleus" />
          <ResultBadge label="Energy" value="Mitochondria" />
          <ResultBadge label="Protein Synth" value="Ribosomes" />
          <ResultBadge label="Support" value={""} />
        </div>
      </LabCard>
    </div>
  );
}
