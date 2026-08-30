"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { MeaningPanel, CollapsibleControls, LabCard, ResultBadge } from "./ui";

// ─── Projectile Motion 3D ───────────────────────────────────────────────────

function ProjectileLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef(0);
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(10);
  const [launched, setLaunched] = useState(false);
  const [showPath, setShowPath] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const elapsedRef = useRef(0);
  const trailPtsRef = useRef<any[]>([]);
  const ballRef = useRef<any>(null);

  const g = 9.81;
  const scale = 8;
  const theta = (angle * Math.PI) / 180;
  const ux = velocity * Math.cos(theta);
  const uy = velocity * Math.sin(theta);
  const T = (2 * velocity * Math.sin(theta)) / g;
  const H = (velocity * velocity * Math.sin(theta) * Math.sin(theta)) / (2 * g);
  const R = (velocity * velocity * Math.sin(2 * theta)) / g;

  const handleLaunch = useCallback(() => {
    setLaunched(false);
    setTimeout(() => {
      trailPtsRef.current = [];
      ballRef.current?.position.set(0, 0.35, 0);
      elapsedRef.current = 0;
      setLaunched(true);
    }, 50);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (cancelled || !el || el.clientWidth === 0) return;
      const rect = el.getBoundingClientRect();

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      const camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 1000);
      camera.position.set(R * scale * 0.6, H * scale + 10, R * scale * 0.8);
      camera.lookAt(R * scale * 0.3, H * scale * 0.3, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;

      const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 }));
      ground.rotation.x = -Math.PI / 2; ground.position.y = -0.05; scene.add(ground);
      scene.add(new THREE.GridHelper(100, 50, 0x334155, 0x1e293b));

      const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 3, 16), new THREE.MeshStandardMaterial({ color: 0x475569 }));
      cannon.position.set(0, 1.5, 0); cannon.rotation.z = Math.PI / 2 - theta; cannon.rotation.y = -0.3;
      scene.add(cannon);

      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.4 }));
      ballRef.current = ball;
      ball.position.set(0, 0.35, 0);
      scene.add(ball);

      const peak = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.6 }));
      peak.position.set((R / 2) * scale, H * scale, 0); peak.visible = false; scene.add(peak);

      const land = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.6 }));
      land.position.set(R * scale, 0.25, 0); land.visible = false; scene.add(land);

      const trailGeo = new THREE.BufferGeometry();
      const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8 }));
      scene.add(trail);

      const vxA = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 2, 0x3b82f6);
      const vyA = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 2, 0xef4444);
      scene.add(vxA); scene.add(vyA);

      scene.add(new THREE.AmbientLight(0x94a3b8, 0.6));
      const dl = new THREE.DirectionalLight(0xffffff, 0.9); dl.position.set(10, 20, 10); scene.add(dl);

      let startTime = performance.now();
      trailPtsRef.current = [];

      const animate = () => {
        animRef.current = requestAnimationFrame(animate);
        if (cancelled) return;
        controls?.update();
        if (launched) {
          const now = (performance.now() - startTime) / 1000;
          elapsedRef.current = now;
          const t = now;
          const x = ux * t;
          const y = uy * t - 0.5 * g * t * t;
          if (y >= 0) {
            ball.position.set(x * scale, y, 0);
            trailPtsRef.current.push(new THREE.Vector3(x * scale, y, 0));
            trail.geometry.setFromPoints(trailPtsRef.current);
          }
          if (y >= 0) {
            vxA.position.copy(ball.position); vxA.setLength(ux * 0.3, 0.15, 0.08);
            vyA.position.copy(ball.position); vyA.setLength(Math.max(uy - g * t, 0) * 0.3, 0.15, 0.08);
          }
          if (y <= 0 && now > 0.1) ball.position.set(R * scale, 0.35, 0);
        }
        trail.visible = showPath;
        vxA.visible = showVectors && launched;
        vyA.visible = showVectors && launched;
        peak.visible = launched && Math.abs(elapsedRef.current - T / 2) < 0.1;
        land.visible = launched && elapsedRef.current >= T - 0.05;
        renderer.render(scene, camera);
      };
      animate();

      const ro = new ResizeObserver(() => {
        const r2 = el.getBoundingClientRect();
        if (r2.width === 0 || r2.height === 0) return;
        camera.aspect = r2.width / r2.height;
        camera.updateProjectionMatrix();
        renderer.setSize(r2.width, r2.height);
      });
      ro.observe(el);

      cleanup = () => {
        cancelled = true;
        cancelAnimationFrame(animRef.current);
        ro.disconnect();
        renderer.dispose();
        el.removeChild(renderer.domElement);
        controls.dispose();
      };
    })();

    return () => { cancelled = true; cleanup?.(); };
  }, [launched, showPath, showVectors, angle, velocity]);

  return (
    <LabCard title="Projectile Motion 3D" subtitle="Parabolic trajectory under gravity">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div ref={containerRef} style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }} className="rounded-lg overflow-hidden border border-border" />
          <div className="flex flex-wrap gap-2">
            <button onClick={handleLaunch} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
              {launched ? "Relaunch" : "Launch"}
            </button>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={showPath} onChange={(e) => setShowPath(e.target.checked)} /> Path
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={showVectors} onChange={(e) => setShowVectors(e.target.checked)} /> Vectors
            </label>
          </div>
        </div>
        <div className="space-y-3">
          <CollapsibleControls label="Parameters" defaultOpen>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Angle</span><span className="font-mono">{angle} deg</span></div>
                <input type="range" min={10} max={80} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Velocity</span><span className="font-mono">{velocity} m/s</span></div>
                <input type="range" min={5} max={20} value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
            </div>
          </CollapsibleControls>
          <div className="grid grid-cols-3 gap-2">
            <ResultBadge label="Time" value={T.toFixed(2)} unit="s" />
            <ResultBadge label="Height" value={H.toFixed(2)} unit="m" />
            <ResultBadge label="Range" value={R.toFixed(2)} unit="m" />
          </div>
          <MeaningPanel title="Projectile Motion" meaning="An object launched into the air subject only to gravity follows a parabolic path." points={[`T = 2u*sin(theta)/g`, `H = u^2*sin^2(theta)/2g`, `R = u^2*sin(2*theta)/g`]} color="blue" />
        </div>
      </div>
    </LabCard>
  );
}

// ─── Wave Interference ───────────────────────────────────────────────────────

function WaveInterferenceLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef(0);
  const [wavelength, setWavelength] = useState(1.5);
  const [separation, setSeparation] = useState(2);
  const [amplitude, setAmplitude] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (cancelled || !el || el.clientWidth === 0) return;
      const rect = el.getBoundingClientRect();

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      const camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 1000);
      camera.position.set(0, 8, 10);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      // Ground plane
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.1;
      scene.add(ground);
      scene.add(new THREE.GridHelper(30, 30, 0x334155, 0x1e293b));

      // Two wave sources
      const sourceGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const sourceMat1 = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.5 });
      const sourceMat2 = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.5 });
      const source1 = new THREE.Mesh(sourceGeo, sourceMat1);
      source1.position.set(-separation / 2, 0.3, 0);
      scene.add(source1);
      const source2 = new THREE.Mesh(sourceGeo, sourceMat2);
      source2.position.set(separation / 2, 0.3, 0);
      scene.add(source2);

      // Wave surface
      const segments = 100;
      const waveGeo = new THREE.PlaneGeometry(20, 20, segments, segments);
      const waveMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        wireframe: false
      });
      const waveMesh = new THREE.Mesh(waveGeo, waveMat);
      waveMesh.rotation.x = -Math.PI / 2;
      waveMesh.position.y = 0;
      scene.add(waveMesh);

      // Wireframe overlay
      const wireGeo = new THREE.WireframeGeometry(new THREE.PlaneGeometry(20, 20, segments, segments));
      const wireMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.3 });
      const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
      wireMesh.rotation.x = -Math.PI / 2;
      wireMesh.position.y = 0.01;
      scene.add(wireMesh);

      scene.add(new THREE.AmbientLight(0x94a3b8, 0.6));
      const dl = new THREE.DirectionalLight(0xffffff, 0.9);
      dl.position.set(5, 10, 5);
      scene.add(dl);

      const clock = new THREE.Clock();

      const animate = () => {
        animRef.current = requestAnimationFrame(animate);
        if (cancelled) return;
        controls?.update();
        const t = clock.getElapsedTime();

        // Update wave surface
        const positions = waveMesh.geometry.attributes.position;
        const count = positions.count;
        for (let i = 0; i < count; i++) {
          const x = positions.getX(i);
          const z = positions.getZ(i);
          const dist1 = Math.sqrt((x + separation / 2) ** 2 + z ** 2);
          const dist2 = Math.sqrt((x - separation / 2) ** 2 + z ** 2);
          const wave1 = (Math.sin(2 * Math.PI * (dist1 / wavelength) - t * 3) / (1 + dist1 * 0.1)) * amplitude;
          const wave2 = (Math.sin(2 * Math.PI * (dist2 / wavelength) - t * 3) / (1 + dist2 * 0.1)) * amplitude;
          positions.setY(i, wave1 + wave2);
        }
        positions.needsUpdate = true;
        waveMesh.geometry.computeVertexNormals();

        // Pulse sources
        const scale = 1 + Math.sin(t * 4) * 0.2;
        source1.scale.setScalar(scale);
        source2.scale.setScalar(scale);

        renderer.render(scene, camera);
      };
      animate();

      const ro = new ResizeObserver(() => {
        const r2 = el.getBoundingClientRect();
        if (r2.width === 0 || r2.height === 0) return;
        camera.aspect = r2.width / r2.height;
        camera.updateProjectionMatrix();
        renderer.setSize(r2.width, r2.height);
      });
      ro.observe(el);

      cleanup = () => {
        cancelled = true;
        cancelAnimationFrame(animRef.current);
        ro.disconnect();
        renderer.dispose();
        el.removeChild(renderer.domElement);
        controls.dispose();
      };
    })();

    return () => { cancelled = true; cleanup?.(); };
  }, [wavelength, separation, amplitude]);

  return (
    <LabCard title="Wave Interference 3D" subtitle="Two-source interference pattern">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div ref={containerRef} style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }} className="rounded-lg overflow-hidden border border-border" />
        </div>
        <div className="space-y-3">
          <CollapsibleControls label="Parameters" defaultOpen>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Wavelength</span><span className="font-mono">{wavelength.toFixed(1)} m</span></div>
                <input type="range" min={0.5} max={3} step={0.1} value={wavelength} onChange={(e) => setWavelength(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Source separation</span><span className="font-mono">{separation.toFixed(1)} m</span></div>
                <input type="range" min={0.5} max={4} step={0.1} value={separation} onChange={(e) => setSeparation(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Amplitude</span><span className="font-mono">{amplitude.toFixed(1)}</span></div>
                <input type="range" min={0.3} max={2} step={0.1} value={amplitude} onChange={(e) => setAmplitude(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
            </div>
          </CollapsibleControls>
          <MeaningPanel title="Wave Interference" meaning="When two waves meet, they interfere constructively (peaks align) or destructively (peak meets trough), creating an interference pattern." points={[`Constructive: path difference = nλ`, `Destructive: path difference = (n+½)λ`, `Double-slit experiment demonstrates this`]} color="cyan" />
        </div>
      </div>
    </LabCard>
  );
}

// ─── Electromagnetic Spectrum ────────────────────────────────────────────────

function EMSpectrumLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState("radio");

  const regions = [
    { name: "radio", color: "#ef4444", freq: "3 kHz - 300 GHz", wavelength: "> 1 mm", uses: "Broadcasting, radar, MRI" },
    { name: "microwave", color: "#f97316", freq: "300 MHz - 300 GHz", wavelength: "1 mm - 1 m", uses: "Microwave ovens, Wi-Fi" },
    { name: "infrared", color: "#eab308", freq: "300 GHz - 430 THz", wavelength: "700 nm - 1 mm", uses: "Remote controls, thermal imaging" },
    { name: "visible", color: "#22c55e", freq: "430 - 750 THz", wavelength: "400 - 700 nm", uses: "Vision, photography" },
    { name: "uv", color: "#3b82f6", freq: "750 THz - 30 PHz", wavelength: "10 - 400 nm", uses: "Sterilization, fluorescence" },
    { name: "xray", color: "#8b5cf6", freq: "30 PHz - 30 EHz", wavelength: "0.01 - 10 nm", uses: "Medical imaging, security" },
    { name: "gamma", color: "#ec4899", freq: "> 30 EHz", wavelength: "< 0.01 nm", uses: "Cancer treatment, astronomy" },
  ];

  const currentRegion = regions.find((r) => r.name === selectedRegion) ?? regions[0];

  return (
    <LabCard title="Electromagnetic Spectrum" subtitle="All forms of electromagnetic radiation">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div ref={containerRef} className="rounded-lg overflow-hidden border border-border p-4">
            {/* Spectrum visualization */}
            <div className="flex h-32 rounded-lg overflow-hidden">
              {regions.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setSelectedRegion(r.name)}
                  className={`flex-1 transition-all hover:opacity-80 ${selectedRegion === r.name ? "ring-2 ring-white ring-offset-2 ring-offset-transparent" : "opacity-60"}`}
                  style={{ backgroundColor: r.color }}
                  title={r.name}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Low Energy</span>
              <span>High Energy</span>
            </div>

            {/* Selected region details */}
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${currentRegion.color}20`, border: `1px solid ${currentRegion.color}40` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentRegion.color }} />
                <h4 className="font-semibold capitalize">{currentRegion.name}</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Frequency:</span> <span className="font-mono">{currentRegion.freq}</span></div>
                <div><span className="text-muted-foreground">Wavelength:</span> <span className="font-mono">{currentRegion.wavelength}</span></div>
                <div className="col-span-2"><span className="text-muted-foreground">Uses:</span> {currentRegion.uses}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <MeaningPanel
            title="Electromagnetic Spectrum"
            meaning="All electromagnetic waves travel at the speed of light (c = 3×10⁸ m/s). They differ in frequency and wavelength."
            points={[`c = f × λ`, `Energy = hf (where h = 6.626×10⁻³⁴ J·s)`, `Higher frequency = higher energy`, `All are transverse waves`]}
            color="amber"
          />
          <CollapsibleControls label="Spectrum Order (low to high energy)">
            <ul className="text-xs space-y-1">
              {regions.map((r) => (
                <li key={r.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                  <span className="capitalize">{r.name}</span>
                </li>
              ))}
            </ul>
          </CollapsibleControls>
        </div>
      </div>
    </LabCard>
  );
}

// ─── Circular Motion 3D ──────────────────────────────────────────────────────

function CircularMotionLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef(0);
  const [radius, setRadius] = useState(2);
  const [omega, setOmega] = useState(1.5);
  const tRef = useRef(0);

  const v = omega * radius;
  const a = omega * omega * radius;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (cancelled || !el || el.clientWidth === 0) return;
      const rect = el.getBoundingClientRect();

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      const camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 1000);
      camera.position.set(0, 12, radius * 6);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      const ring = new THREE.Mesh(new THREE.RingGeometry(radius - 0.05, radius + 0.05, 64), new THREE.MeshStandardMaterial({ color: 0x334155, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; scene.add(ring);
      const pp: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) { const ang = (i / 128) * Math.PI * 2; pp.push(new THREE.Vector3(Math.cos(ang) * radius, 0, Math.sin(ang) * radius)); }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pp), new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.5 })));
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x4f46e5, emissiveIntensity: 0.5 }));
      ball.position.set(radius, 0.5, 0); scene.add(ball);
      const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({ color: 0xf472b6 }));
      pivot.position.y = 0.2; scene.add(pivot);
      const vA = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 2.5, 0x22c55e);
      const aA = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 0), 2.5, 0xef4444);
      scene.add(vA); scene.add(aA);
      scene.add(new THREE.AmbientLight(0x94a3b8, 0.6));
      const dl = new THREE.DirectionalLight(0xffffff, 0.9); dl.position.set(5, 15, 10); scene.add(dl);

      const animate = () => {
        animRef.current = requestAnimationFrame(animate);
        if (cancelled) return;
        controls?.update();
        tRef.current += 0.016;
        const t = tRef.current;
        const x = Math.cos(omega * t) * radius;
        const z = Math.sin(omega * t) * radius;
        ball.position.set(x, 0.5, z);
        vA.position.set(x, 0.5, z);
        vA.setDirection(new THREE.Vector3(-Math.sin(omega * t), 0, Math.cos(omega * t)));
        vA.setLength(v * 0.4, 0.3, 0.15);
        aA.position.set(x, 0.5, z);
        aA.setDirection(new THREE.Vector3(-Math.cos(omega * t), 0, -Math.sin(omega * t)));
        aA.setLength(a * 0.3, 0.3, 0.15);
        renderer.render(scene, camera);
      };
      animate();

      const ro = new ResizeObserver(() => {
        const r2 = el.getBoundingClientRect();
        if (r2.width === 0 || r2.height === 0) return;
        camera.aspect = r2.width / r2.height;
        camera.updateProjectionMatrix();
        renderer.setSize(r2.width, r2.height);
      });
      ro.observe(el);

      cleanup = () => {
        cancelled = true;
        cancelAnimationFrame(animRef.current);
        ro.disconnect();
        renderer.dispose();
        el.removeChild(renderer.domElement);
        controls.dispose();
      };
    })();

    return () => { cancelled = true; cleanup?.(); };
  }, [radius, omega]);

  return (
    <LabCard title="Uniform Circular Motion 3D" subtitle="Constant speed on a circular path">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div ref={containerRef} style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }} className="rounded-lg overflow-hidden border border-border" />
        </div>
        <div className="space-y-3">
          <CollapsibleControls label="Parameters" defaultOpen>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Radius</span><span className="font-mono">{radius} m</span></div>
                <input type="range" min={1} max={4} step={0.1} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Angular speed</span><span className="font-mono">{omega} rad/s</span></div>
                <input type="range" min={0.5} max={5} step={0.1} value={omega} onChange={(e) => setOmega(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
            </div>
          </CollapsibleControls>
          <div className="grid grid-cols-3 gap-2">
            <ResultBadge label="omega" value={omega.toFixed(1)} unit="rad/s" />
            <ResultBadge label="v" value={v.toFixed(2)} unit="m/s" />
            <ResultBadge label="a_c" value={a.toFixed(2)} unit="m/s2" />
          </div>
          <MeaningPanel title="Uniform Circular Motion" meaning="An object moving at constant speed along a circular path experiences centripetal acceleration directed toward the center." points={[`v = omega*r`, `a_c = omega^2*r`, `Period = 2*pi/omega`]} color="purple" />
        </div>
      </div>
    </LabCard>
  );
}

// ─── SHM 3D ──────────────────────────────────────────────────────────────────

function SHMLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const [amplitude, setAmplitude] = useState(1.5);
  const [frequency, setFrequency] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const ptsRef = useRef<{ t: number; x: number }[]>([]);
  const tRef = useRef(0);

  const omega = 2 * Math.PI * frequency;
  const Tp = 1 / frequency;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (cancelled || !el || el.clientWidth === 0) return;
      const rect = el.getBoundingClientRect();

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      const camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 1000);
      camera.position.set(0, 2, 10);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      const rail = new THREE.Mesh(new THREE.BoxGeometry(amplitude * 6, 0.1, 0.4), new THREE.MeshStandardMaterial({ color: 0x334155 }));
      rail.position.y = -0.5; scene.add(rail);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 1.5), new THREE.MeshStandardMaterial({ color: 0x475569 }));
      wall.position.set(-amplitude * 2.5, 0, 0); scene.add(wall);
      const sp: THREE.Vector3[] = [];
      const spring = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xa78bfa }));
      scene.add(spring);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 0.4 }));
      ball.position.set(amplitude, 0, 0); scene.add(ball);
      scene.add(new THREE.AmbientLight(0x94a3b8, 0.6));
      const dl = new THREE.DirectionalLight(0xffffff, 0.9); dl.position.set(5, 10, 10); scene.add(dl);

      const canvas = canvasRef.current;
      if (canvas) { canvas.width = 300; canvas.height = 150; canvas.style.width = "100%"; canvas.style.height = "100px"; canvas.style.borderRadius = "8px"; canvas.style.border = "1px solid #334155"; }

      const animate = () => {
        animRef.current = requestAnimationFrame(animate);
        if (cancelled) return;
        controls?.update();
        tRef.current += 0.016;
        const t = tRef.current;
        setElapsed(t);
        ptsRef.current.push({ t, x: amplitude * Math.cos(omega * t) });
        if (ptsRef.current.length > 2000) ptsRef.current.shift();
        const bx = amplitude * Math.cos(omega * t);
        ball.position.x = bx;
        const spts: THREE.Vector3[] = [];
        const wx = -amplitude * 2.5;
        for (let i = 0; i <= 12; i++) { const f = i / 12; spts.push(new THREE.Vector3(wx + (bx - wx) * f, Math.sin(f * Math.PI * 4) * 0.25, 0)); }
        spring.geometry.setFromPoints(spts);
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const W = canvas.width, H = canvas.height;
            ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, H);
            ctx.strokeStyle = "#334155"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(30, H / 2); ctx.lineTo(W - 10, H / 2); ctx.stroke();
            ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2;
            ctx.beginPath();
            const p = ptsRef.current;
            for (let i = 0; i < p.length; i++) {
              const px = 30 + (i / 2000) * (W - 40);
              const py = H / 2 - (p[i].x / amplitude) * (H / 2 - 10);
              if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
        }
        renderer.render(scene, camera);
      };
      animate();

      const ro = new ResizeObserver(() => {
        const r2 = el.getBoundingClientRect();
        if (r2.width === 0 || r2.height === 0) return;
        camera.aspect = r2.width / r2.height;
        camera.updateProjectionMatrix();
        renderer.setSize(r2.width, r2.height);
      });
      ro.observe(el);

      cleanup = () => {
        cancelled = true;
        cancelAnimationFrame(animRef.current);
        ro.disconnect();
        renderer.dispose();
        el.removeChild(renderer.domElement);
        controls.dispose();
      };
    })();

    return () => { cancelled = true; cleanup?.(); };
  }, [amplitude, frequency]);

  return (
    <LabCard title="Simple Harmonic Motion 3D" subtitle="Oscillating mass on a spring">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-col sm:flex-row gap-4">
            <div ref={containerRef} style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }} className="rounded-lg overflow-hidden border border-border flex-1" />
            <canvas ref={canvasRef} className="rounded-lg border border-border sm:w-48" />
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>t = {elapsed.toFixed(2)} s</span>
            <span>x = {(amplitude * Math.cos(omega * elapsed)).toFixed(3)} m</span>
          </div>
        </div>
        <div className="space-y-3">
          <CollapsibleControls label="Parameters" defaultOpen>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Amplitude</span><span className="font-mono">{amplitude} m</span></div>
                <input type="range" min={0.5} max={2.5} step={0.1} value={amplitude} onChange={(e) => setAmplitude(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Frequency</span><span className="font-mono">{frequency} Hz</span></div>
                <input type="range" min={0.5} max={5} step={0.1} value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
            </div>
          </CollapsibleControls>
          <div className="grid grid-cols-3 gap-2">
            <ResultBadge label="Period" value={Tp.toFixed(2)} unit="s" />
            <ResultBadge label="omega" value={omega.toFixed(1)} unit="rad/s" />
            <ResultBadge label="f" value={frequency.toFixed(1)} unit="Hz" />
          </div>
          <MeaningPanel title="Simple Harmonic Motion" meaning="A restoring force proportional to displacement produces sinusoidal oscillation." points={[`T = 1/f`, `omega = 2*pi*f`, `x(t) = A*cos(omega*t)`]} color="cyan" />
        </div>
      </div>
    </LabCard>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function PhysicsLab() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Physics Lab</h2>
        <p className="text-sm text-muted-foreground">Interactive simulations of classical mechanics and wave phenomena.</p>
      </div>
      <ProjectileLab />
      <CircularMotionLab />
      <SHMLab />
      <WaveInterferenceLab />
      <EMSpectrumLab />
    </div>
  );
}
