"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { MeaningPanel, CollapsibleControls, LabCard, ResultBadge } from "./ui";

type MaybeThree = typeof import("three");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeEval(expr: string, x: number): number {
  const s = expr.replace(/\^/g, "**").replace(/sin\(/g, "Math.sin(").replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(").replace(/abs\(/g, "Math.abs(").replace(/sqrt\(/g, "Math.sqrt(")
    .replace(/log\(/g, "Math.log(").replace(/exp\(/g, "Math.exp(").replace(/pi/gi, "Math.PI")
    .replace(/\bx\b/g, `(${x})`);
  try {
    const r = new Function("return (" + s + ")")();
    return typeof r === "number" && isFinite(r) ? r : NaN;
  } catch { return NaN; }
}

const PRESETS = ["x^2", "x^3", "sin(x)", "cos(x)", "2*x+3", "x^2-4", "abs(x)", "1/x"];

// ---------------------------------------------------------------------------
// Exp 1: Function Grapher (Canvas 2D)
// ---------------------------------------------------------------------------

function FunctionGrapher() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expression, setExpression] = useState("x^2");
  const [cx, setCx] = useState<number | null>(null);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const r = c.getBoundingClientRect();
    c.width = r.width * dpr; c.height = r.height * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const w = r.width, h = r.height, cx2 = w / 2, cy = h / 2, sc = 40;
    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1;
    for (let x = cx2 % sc; x < w; x += sc) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = cy % sc; y < h; y += sc) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx2, 0); ctx.lineTo(cx2, h); ctx.stroke();
    ctx.fillStyle = "#94a3b8"; ctx.font = "11px monospace";
    ctx.fillText("x", w - 14, cy - 6); ctx.fillText("y", cx2 + 6, 14);
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2.5; ctx.beginPath();
    let started = false;
    for (let px = 0; px <= w; px++) {
      const x = (px - cx2) / sc;
      const y = cy - safeEval(expression, x) * sc;
      if (isNaN(y) || !isFinite(y)) { started = false; continue; }
      if (!started) { ctx.moveTo(px, y); started = true; } else ctx.lineTo(px, y);
    }
    ctx.stroke();
    if (cx !== null) {
      const xv = ((cx - cx2) / sc).toFixed(2);
      const yv = safeEval(expression, (cx - cx2) / sc);
      if (!isNaN(yv)) {
        const py = cy - yv * sc;
        ctx.fillStyle = "#f87171"; ctx.beginPath(); ctx.arc(cx, py, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#f87171"; ctx.font = "11px monospace";
        ctx.fillText(`(${xv}, ${yv.toFixed(2)})`, cx + 8, py - 8);
      }
    }
  }, [expression, cx]);

  useEffect(() => {
    draw();
    const c = canvasRef.current;
    if (!c) return;
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="flex-1 w-full">
        <canvas ref={canvasRef} className="w-full rounded-lg border border-border"
          style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }}
          onMouseMove={(e) => setCx(e.clientX - e.currentTarget.getBoundingClientRect().left)}
          onMouseLeave={() => setCx(null)}
        />
      </div>
      <div className="w-full sm:w-52 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((fn) => (
            <button key={fn} type="button" onClick={() => setExpression(fn)}
              className={`text-xs px-2 py-1 rounded-md border transition-colors ${expression === fn ? "bg-blue-500/20 border-blue-500/50 text-blue-300" : "border-border bg-card text-muted-foreground hover:border-blue-500/30"}`}>
              {fn}
            </button>
          ))}
        </div>
        <input type="text" value={expression} onChange={(e) => setExpression(e.target.value)}
          className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="e.g. x^2" />
        <MeaningPanel
          title={`Graph of f(x) = ${expression}`}
          meaning="A function maps each input x to exactly one output y. The graph shows the relationship visually."
          points={["Domain: all x where f(x) is defined", "Range: all possible y values", "Slope = dy/dx"]}
          color="blue"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exp 2: 3D Parabola
// ---------------------------------------------------------------------------

function Parabola3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = mountRef.current;
    if (!m) return;
    let C = false;

    (async () => {
      const T = await import("three") as typeof import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (C || !m || m.clientWidth === 0) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      const camera = new THREE.PerspectiveCamera(60, m.clientWidth / m.clientHeight, 0.1, 200);
      camera.position.set(4, 3, 5);
      camera.lookAt(0, 1, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(m.clientWidth, m.clientHeight);
      m.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const key = new THREE.DirectionalLight(0xffffff, 1.3);
      key.position.set(4, 6, 3);
      scene.add(key);
      scene.add(new THREE.GridHelper(12, 24, 0x334155, 0x1e293b).translateY(-0.5));

      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 200; i++) { const x = (i / 200) * 8 - 4; pts.push(new THREE.Vector3(x, x * x * 0.3 - 0.5, 0)); }
      const curve = new THREE.CatmullRomCurve3(pts);
      scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 200, 0.06, 12, false), new THREE.MeshStandardMaterial({ color: 0xf87171, emissive: 0x7f1d1d, emissiveIntensity: 0.3, metalness: 0.4, roughness: 0.5 })));
      const mg = new THREE.SphereGeometry(0.1, 16, 12);
      const mm = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x7f1d1d, emissiveIntensity: 0.5 });
      for (let i = 0; i <= 20; i++) { const s = new THREE.Mesh(mg, mm); s.position.copy(curve.getPoint(i / 20)); scene.add(s); }
      const fg = new THREE.SphereGeometry(0.18, 24, 18);
      const fm = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0x78350f, emissiveIntensity: 0.7 });
      const focus = new THREE.Mesh(fg, fm);
      focus.position.set(0, 0.35, 0);
      scene.add(focus);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 8, 32), new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.6 }));
      ring.position.copy(focus.position);
      scene.add(ring);

      const ro = new ResizeObserver(() => {
        const w = m.clientWidth, h = m.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      ro.observe(m);

      const clock = new THREE.Clock();
      let frame = 0;
      const animate = () => {
        frame = requestAnimationFrame(animate);
        if (C) return;
        ring.rotation.x = clock.getElapsedTime() * 0.8;
        ring.rotation.z = clock.getElapsedTime() * 0.5;
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        C = true;
        cancelAnimationFrame(frame);
        ro.disconnect();
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === m) m.removeChild(renderer.domElement);
      };
    })();

    return () => { C = true; };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div ref={mountRef} className="flex-1 rounded-xl border border-border bg-card overflow-hidden" style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }} />
      <div className="w-full sm:w-56 flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          <ResultBadge label="Vertex" value="(0, 0)" />
          <ResultBadge label="Focus" value="(0, 0.83)" />
          <ResultBadge label="Directrix" value="y = -0.83" />
        </div>
        <MeaningPanel title="Parabola in 3D" meaning="A parabola is the set of points equidistant from a fixed point (focus) and a fixed line (directrix)." points={["Focus lies inside the curve", "Rays parallel to axis reflect through focus", "Used in satellite dishes"]} color="amber" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exp 3: Coordinate Geometry 3D
// ---------------------------------------------------------------------------

type GeoMode = "points-lines" | "plane" | "vectors";

function CoordinateGeometry() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<GeoMode>("points-lines");

  useEffect(() => {
    const m = mountRef.current;
    if (!m) return;
    let C = false;

    (async () => {
      const T = await import("three") as typeof import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (C || !m || m.clientWidth === 0) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      const camera = new THREE.PerspectiveCamera(60, m.clientWidth / m.clientHeight, 0.1, 200);
      camera.position.set(4, 3.5, 4);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(m.clientWidth, m.clientHeight);
      m.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.2;
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      scene.add(new THREE.GridHelper(10, 20, 0x334155, 0x1e293b));
      for (const [dir, col] of [[new THREE.Vector3(1, 0, 0), 0xef4444], [new THREE.Vector3(0, 1, 0), 0x22c55e], [new THREE.Vector3(0, 0, 1), 0x3b82f6]] as [THREE.Vector3, number][]) {
        scene.add(new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), 4.5, col, 0.3, 0.2));
      }

      const sg = new THREE.SphereGeometry(0.15, 24, 18);
      const colors = [0xef4444, 0x3b82f6, 0x22c55e, 0xfacc15, 0xa855f7];

      if (mode === "points-lines") {
        const points = [new THREE.Vector3(-1.5, 0.5, 1), new THREE.Vector3(1, 1.2, -0.5), new THREE.Vector3(0.5, -0.3, 1.5), new THREE.Vector3(-0.8, 0.8, -1), new THREE.Vector3(2, 0.2, 0.5)];
        points.forEach((p, i) => { const s = new THREE.Mesh(sg, new THREE.MeshStandardMaterial({ color: colors[i], emissive: colors[i], emissiveIntensity: 0.3 })); s.position.copy(p); scene.add(s); });
        for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([points[i], points[j]]), new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.5 })));
      } else if (mode === "plane") {
        const pg = new THREE.PlaneGeometry(6, 6, 12, 12);
        const pm = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.25, side: THREE.DoubleSide }));
        pm.position.y = 0.5;
        scene.add(pm);
        scene.add(new THREE.LineSegments(new THREE.EdgesGeometry(pg), new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.6 })).translateY(0.5));
      } else {
        const vectors = [[new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 1.5, 0), colors[0]], [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1, 2, 0.5), colors[1]], [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 1, -1.5), colors[2]]] as [THREE.Vector3, THREE.Vector3, number][];
        vectors.forEach(([, end, col]) => {
          const dir = end.clone();
          scene.add(new THREE.ArrowHelper(dir.normalize(), new THREE.Vector3(0, 0, 0), dir.length(), col, 0.22, 0.14));
        });
      }

      const ro = new ResizeObserver(() => {
        const w = m.clientWidth, h = m.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      ro.observe(m);

      const animate = () => {
        requestAnimationFrame(animate);
        if (C) return;
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        C = true;
        ro.disconnect();
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === m) m.removeChild(renderer.domElement);
      };
    })();

    return () => { C = true; };
  }, [mode]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div ref={mountRef} className="flex-1 rounded-xl border border-border bg-card overflow-hidden" style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }} />
      <div className="w-full sm:w-56 flex flex-col gap-3">
        <select value={mode} onChange={(e) => setMode(e.target.value as GeoMode)}
          className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50">
          <option value="points-lines">Points &amp; Lines</option>
          <option value="plane">Plane</option>
          <option value="vectors">Vectors</option>
        </select>
        <MeaningPanel title="Coordinate Geometry in 3D" meaning="Points, lines, planes, and vectors in three-dimensional space form the foundation of analytic geometry." points={["A point needs 3 coordinates", "A line is determined by 2 points", "A plane is determined by 3 points"]} color="green" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exp 4: 3D Surfaces
// ---------------------------------------------------------------------------

type SurfaceType = "saddle" | "wave" | "ripple" | "peak" | "plane" | "cylinder";

function MathSurfaces() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [surfaceType, setSurfaceType] = useState<SurfaceType>("saddle");

  useEffect(() => {
    const m = mountRef.current;
    if (!m) return;
    let C = false;

    (async () => {
      const T = await import("three") as typeof import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (C || !m || m.clientWidth === 0) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      const camera = new THREE.PerspectiveCamera(60, m.clientWidth / m.clientHeight, 0.1, 200);
      camera.position.set(5, 4, 5);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(m.clientWidth, m.clientHeight);
      m.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dl = new THREE.DirectionalLight(0xffffff, 1.3);
      dl.position.set(4, 6, 3);
      scene.add(dl);
      const pl = new THREE.PointLight(0x60a5fa, 0.5);
      pl.position.set(-4, -1, -3);
      scene.add(pl);
      scene.add(new THREE.GridHelper(10, 20, 0x334155, 0x1e293b));

      const N = 80, size = 5;
      const pos: number[] = [], col: number[] = [], idx: number[] = [];
      for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
        const u = (i / N) * size - size / 2, v = (j / N) * size - size / 2;
        let w = 0;
        if (surfaceType === "saddle") w = (u * u - v * v) * 0.25;
        else if (surfaceType === "wave") w = Math.sin(u * 1.5) * Math.cos(v * 1.5) * 1.2;
        else if (surfaceType === "ripple") { const r = Math.sqrt(u * u + v * v); w = Math.sin(r * 2) * Math.exp(-r * 0.15) * 1.5; }
        else if (surfaceType === "peak") { const r = Math.sqrt(u * u + v * v); w = 2 * Math.exp(-r * 0.4); }
        else if (surfaceType === "plane") w = 0.5 * u + 0.3 * v + 0.5;
        else if (surfaceType === "cylinder") w = Math.cos(u * 1.5) * 1.2;
        pos.push(u, w, v);
        const t = Math.max(0, Math.min(1, (w + 2) / 4));
        const r2 = Math.round(0.12 + t * 0.88), g = Math.round(0.12 + t * 0.76), b = Math.round(0.45 - t * 0.25);
        col.push(r2 / 255, g / 255, b / 255);
        if (i < N && j < N) { const a = i * (N + 1) + j; idx.push(a, a + 1, a + N + 1, a + 1, a + N + 2, a + N + 1); }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.2, roughness: 0.6, side: THREE.DoubleSide }));
      scene.add(mesh);
      scene.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 })));

      const ro = new ResizeObserver(() => {
        const w = m.clientWidth, h = m.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      ro.observe(m);

      const animate = () => {
        requestAnimationFrame(animate);
        if (C) return;
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        C = true;
        ro.disconnect();
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === m) m.removeChild(renderer.domElement);
      };
    })();

    return () => { C = true; };
  }, [surfaceType]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div ref={mountRef} className="flex-1 rounded-xl border border-border bg-card overflow-hidden" style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }} />
      <div className="w-full sm:w-56 flex flex-col gap-3">
        <select value={surfaceType} onChange={(e) => setSurfaceType(e.target.value as SurfaceType)}
          className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50">
          <option value="saddle">Saddle (z = x^2 - y^2)</option>
          <option value="wave">Wave (z = sin(x)cos(y))</option>
          <option value="ripple">Ripple (z = sin(r)e^-r)</option>
          <option value="peak">Peak (z = 2e^-r)</option>
          <option value="plane">Plane (z = 0.5x + 0.3y + 0.5)</option>
          <option value="cylinder">Cylinder (z = cos(x))</option>
        </select>
        <MeaningPanel title="3D Mathematical Surfaces" meaning="A surface in 3D is the graph of a function z = f(x, y). Different functions produce different shapes revealing unique curvature properties." points={["Saddle: hyperbolic paraboloid", "Wave: periodic in two directions", "Peak: exponential decay from center"]} color="purple" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exp 5: Derivative Visualizer
// ---------------------------------------------------------------------------

function DerivativeViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expression, setExpression] = useState("x^2");
  const [dx, setDx] = useState(0.5);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const r = c.getBoundingClientRect();
    c.width = r.width * dpr; c.height = r.height * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const w = r.width, h = r.height, cx2 = w / 2, cy = h / 2, sc = 40;

    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1;
    for (let x = cx2 % sc; x < w; x += sc) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = cy % sc; y < h; y += sc) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx2, 0); ctx.lineTo(cx2, h); ctx.stroke();

    ctx.fillStyle = "#94a3b8"; ctx.font = "11px monospace";
    ctx.fillText("x", w - 14, cy - 6); ctx.fillText("y", cx2 + 6, 14);

    // Draw f(x)
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= w; px++) {
      const x = (px - cx2) / sc;
      const y = cy - safeEval(expression, x) * sc;
      if (isNaN(y) || !isFinite(y) || y < -1000 || y > h + 1000) { started = false; continue; }
      if (!started) { ctx.moveTo(px, y); started = true; } else ctx.lineTo(px, y);
    }
    ctx.stroke();

    // Draw f'(x) approximation (secant slope)
    if (hoverX !== null) {
      const x0 = (hoverX - cx2) / sc;
      const y0 = safeEval(expression, x0);
      const y1 = safeEval(expression, x0 + dx / sc * 40); // scale dx to canvas
      const slope = (y1 - y0) / (dx / sc * 40);

      // Tangent line
      const tx = hoverX;
      const ty = cy - y0 * sc;
      ctx.strokeStyle = "#f87171"; ctx.lineWidth = 2;
      ctx.beginPath();
      const slopeX = 3; // pixels
      ctx.moveTo(tx - slopeX, ty - slope * slopeX * sc);
      ctx.lineTo(tx + slopeX, ty + slope * slopeX * sc);
      ctx.stroke();

      // Point
      ctx.fillStyle = "#f87171";
      ctx.beginPath(); ctx.arc(tx, ty, 5, 0, Math.PI * 2); ctx.fill();

      // Info
      ctx.fillStyle = "#f87171"; ctx.font = "11px monospace";
      ctx.fillText(`f(${x0.toFixed(2)}) = ${y0.toFixed(3)}`, tx + 10, ty - 10);
      ctx.fillText(`f' ≈ ${slope.toFixed(3)}`, tx + 10, ty + 5);
    }
  }, [expression, dx, hoverX]);

  useEffect(() => {
    draw();
    const c = canvasRef.current;
    if (!c) return;
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="flex-1 w-full">
        <canvas ref={canvasRef} className="w-full rounded-lg border border-border"
          style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }}
          onMouseMove={(e) => setHoverX(e.clientX - e.currentTarget.getBoundingClientRect().left)}
          onMouseLeave={() => setHoverX(null)}
        />
      </div>
      <div className="w-full sm:w-52 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {["x^2", "x^3", "sin(x)", "e^x", "ln(x)", "sqrt(x)"].map((fn) => (
            <button key={fn} type="button" onClick={() => setExpression(fn)}
              className={`text-xs px-2 py-1 rounded-md border transition-colors ${expression === fn ? "bg-blue-500/20 border-blue-500/50 text-blue-300" : "border-border bg-card text-muted-foreground hover:border-blue-500/30"}`}>
              {fn}
            </button>
          ))}
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">dx (step size)</span><span className="font-mono">{dx.toFixed(2)}</span></div>
          <input type="range" min={0.1} max={2} step={0.1} value={dx} onChange={(e) => setDx(Number(e.target.value))} className="w-full accent-red-500" />
        </div>
        <MeaningPanel
          title="Derivative as Slope"
          meaning="The derivative f'(x) represents the instantaneous rate of change (slope) of f(x) at point x."
          points={[`f'(x) = lim(dx→0) [f(x+dx)-f(x)]/dx`, "Geometrically: slope of tangent line", "Physically: velocity = derivative of position"]}
          color="red"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exp 6: Matrix Transformations 3D
// ---------------------------------------------------------------------------

function MatrixTransform3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<"rotate" | "scale" | "shear">("rotate");
  const [angle, setAngle] = useState(45);
  const [scaleFactor, setScaleFactor] = useState(1.5);
  const [shearFactor, setShearFactor] = useState(0.5);

  useEffect(() => {
    const m = mountRef.current;
    if (!m) return;
    let C = false;

    (async () => {
      const T = await import("three") as typeof import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (C || !m || m.clientWidth === 0) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      const camera = new THREE.PerspectiveCamera(60, m.clientWidth / m.clientHeight, 0.1, 200);
      camera.position.set(4, 3, 4);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(m.clientWidth, m.clientHeight);
      m.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dl = new THREE.DirectionalLight(0xffffff, 1.3);
      dl.position.set(4, 6, 3);
      scene.add(dl);
      scene.add(new THREE.GridHelper(10, 20, 0x334155, 0x1e293b));

      // Original cube (wireframe, gray)
      const origGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const origEdges = new THREE.EdgesGeometry(origGeo);
      const origLine = new THREE.LineSegments(origEdges, new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.5 }));
      scene.add(origLine);

      // Transformed cube (solid, colored)
      const transGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const transMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        metalness: 0.2,
        roughness: 0.5
      });
      const transMesh = new THREE.Mesh(transGeo, transMat);
      scene.add(transMesh);

      const transEdges = new THREE.EdgesGeometry(transGeo);
      const transLine = new THREE.LineSegments(transEdges, new THREE.LineBasicMaterial({ color: 0x60a5fa }));
      transMesh.add(transLine);

      const clock = new THREE.Clock();

      const updateTransform = () => {
        const rad = (angle * Math.PI) / 180;
        const s = scaleFactor;
        const k = shearFactor;

        if (transform === "rotate") {
          transMesh.rotation.y = rad + clock.getElapsedTime() * 0.2;
          transMesh.rotation.x = rad * 0.5;
        } else if (transform === "scale") {
          transMesh.scale.set(s, s, s);
          transMesh.rotation.y = clock.getElapsedTime() * 0.2;
        } else if (transform === "shear") {
          transMesh.rotation.y = clock.getElapsedTime() * 0.2;
          // Apply shear via matrix
          const shearMatrix = new THREE.Matrix4();
          shearMatrix.set(
            1, k, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
          );
          transMesh.applyMatrix4(shearMatrix);
        }
      };

      const animate = () => {
        requestAnimationFrame(animate);
        if (C) return;
        controls.update();
        updateTransform();
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        C = true;
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === m) m.removeChild(renderer.domElement);
      };
    })();

    return () => { C = true; };
  }, [transform, angle, scaleFactor, shearFactor]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div ref={mountRef} className="flex-1 rounded-xl border border-border bg-card overflow-hidden" style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }} />
      <div className="w-full sm:w-56 flex flex-col gap-3">
        <div className="flex gap-1">
          {(["rotate", "scale", "shear"] as const).map((t) => (
            <button key={t} onClick={() => setTransform(t)}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                transform === t
                  ? "bg-blue-500 text-white"
                  : "bg-card border border-border text-muted-foreground hover:border-blue-500/50"
              }`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {transform === "rotate" && (
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Rotation angle</span><span className="font-mono">{angle}°</span></div>
            <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
        )}

        {transform === "scale" && (
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Scale factor</span><span className="font-mono">{scaleFactor.toFixed(1)}</span></div>
            <input type="range" min={0.3} max={3} step={0.1} value={scaleFactor} onChange={(e) => setScaleFactor(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
        )}

        {transform === "shear" && (
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Shear factor</span><span className="font-mono">{shearFactor.toFixed(2)}</span></div>
            <input type="range" min={-1} max={1} step={0.05} value={shearFactor} onChange={(e) => setShearFactor(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
        )}

        <MeaningPanel
          title="Matrix Transformations"
          meaning="Linear transformations can be represented by matrices. They transform points in space while preserving straight lines and the origin."
          points={[
            "Rotation: [cosθ -sinθ; sinθ cosθ]",
            "Scale: [sx 0; 0 sy]",
            "Shear: [1 k; 0 1]",
            "Combined: multiply matrices",
          ]}
          color="blue"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function MathLab() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Mathematics Lab</h2>
        <p className="text-sm text-muted-foreground">Interactive experiments in algebra, geometry, and calculus visualizations.</p>
      </div>
      <LabCard title="Experiment 1: Function Grapher" subtitle="2D Canvas">
        <FunctionGrapher />
      </LabCard>
      <LabCard title="Experiment 2: 3D Parabola" subtitle="y = x^2">
        <Parabola3D />
      </LabCard>
      <LabCard title="Experiment 3: Coordinate Geometry" subtitle="Points, Planes & Vectors">
        <CoordinateGeometry />
      </LabCard>
      <LabCard title="Experiment 4: 3D Surfaces" subtitle="Parametric surfaces">
        <MathSurfaces />
      </LabCard>
      <LabCard title="Experiment 5: Derivative Visualizer" subtitle="Slope of tangent line">
        <DerivativeViz />
      </LabCard>
      <LabCard title="Experiment 6: Matrix Transformations" subtitle="Rotate, Scale, Shear">
        <MatrixTransform3D />
      </LabCard>
    </div>
  );
}
