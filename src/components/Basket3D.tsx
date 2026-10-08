'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * EFFECT-01 — real-time WebGL produce basket.
 *
 * A Three.js scene renders a woven basket filled with produce. It can be
 * orbited by dragging (single pointer, no page scroll hijack) and by the
 * arrow keys, and it auto-rotates gently when idle.
 *
 * Fallbacks, in order of precedence:
 *   1. prefers-reduced-motion → poster image, no canvas, no requestAnimationFrame.
 *   2. WebGL unavailable / context creation throws → poster image.
 *   3. IntersectionObserver off-screen → render loop paused (no GPU cost).
 *
 * three.js is imported dynamically so it never lands in the critical path
 * (protects LCP, per EFFECT-23).
 */

interface Basket3DProps {
  posterSrc: string;
  posterAlt: string;
}

export default function Basket3D({ posterSrc, posterAlt }: Basket3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'pending' | 'webgl' | 'poster'>('pending');

  useEffect(() => {
    // ── 1. Reduced motion → poster, immediately.
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setMode('poster');
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    // ── 2. Load three.js and build the scene.
    (async () => {
      let THREE: typeof import('three');
      try {
        THREE = await import('three');
      } catch {
        if (!disposed) setMode('poster');
        return;
      }
      if (disposed) return;

      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'low-power',
        });
      } catch {
        setMode('poster');
        return;
      }

      // Verify a context actually exists (some environments return a stub).
      if (!renderer.getContext()) {
        setMode('poster');
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 2.1, 6.4);
      camera.lookAt(0, 0.35, 0);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      // ── Lighting ─────────────────────────────────────────────────────
      scene.add(new THREE.HemisphereLight(0xffffff, 0x9fbfa8, 1.5));

      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(3.4, 6, 4.2);
      scene.add(key);

      const rimLight = new THREE.DirectionalLight(0x8fd6a4, 1.15);
      rimLight.position.set(-4, 2.6, -3.6);
      scene.add(rimLight);

      const group = new THREE.Group();
      scene.add(group);

      // ── Basket (tapered open cylinder + rim torus + weave rings) ─────
      const basketMat = new THREE.MeshStandardMaterial({
        color: 0xc59a5b,
        roughness: 0.85,
        metalness: 0.02,
        side: THREE.DoubleSide,
      });

      const basket = new THREE.Mesh(
        new THREE.CylinderGeometry(1.72, 1.28, 1.25, 40, 1, true),
        basketMat
      );
      basket.position.y = 0.05;
      group.add(basket);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.28, 1.28, 0.1, 40),
        new THREE.MeshStandardMaterial({ color: 0xa87f45, roughness: 0.9 })
      );
      base.position.y = -0.56;
      group.add(base);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(1.72, 0.085, 12, 48),
        new THREE.MeshStandardMaterial({ color: 0xb98f52, roughness: 0.75 })
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.68;
      group.add(rim);

      const fibreMat = new THREE.MeshStandardMaterial({
        color: 0xb0824a,
        roughness: 0.9,
      });
      [0.18, -0.12, -0.4].forEach((y, i) => {
        const r = 1.62 - i * 0.13;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.026, 8, 40), fibreMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        group.add(ring);
      });

      // ── Produce mound ────────────────────────────────────────────────
      // Deterministic layout so the basket looks identical on every load.
      const produceSpecs: { color: number; r: number; x: number; y: number; z: number }[] = [
        { color: 0xd94f3d, r: 0.42, x: 0.0, y: 0.86, z: 0.0 },     // tomato
        { color: 0x2f8f4e, r: 0.38, x: 0.68, y: 0.72, z: 0.22 },   // pepper
        { color: 0xe0a92c, r: 0.36, x: -0.62, y: 0.74, z: 0.3 },   // mango
        { color: 0x4f8f3a, r: 0.34, x: 0.3, y: 0.7, z: -0.62 },   // avocado
        { color: 0x8f4f2f, r: 0.3, x: -0.34, y: 0.7, z: -0.66 },   // potato
        { color: 0xd97b3d, r: 0.3, x: 0.82, y: 0.56, z: -0.42 },   // carrot top
        { color: 0x6f9c3a, r: 0.32, x: -0.86, y: 0.56, z: -0.34 }, // herbs
        { color: 0xb8332f, r: 0.27, x: 0.1, y: 1.2, z: -0.16 },    // chilli cluster
        { color: 0xe8d24a, r: 0.28, x: -0.2, y: 1.18, z: 0.22 },   // banana tip
        { color: 0xd94f3d, r: 0.26, x: 0.44, y: 1.14, z: 0.36 },   // second tomato
        { color: 0x2f8f4e, r: 0.24, x: -0.5, y: 1.1, z: -0.44 },   // second pepper
      ];

      produceSpecs.forEach((spec, i) => {
        // Slight irregular scale keeps the spheres from reading as beads.
        const geo = new THREE.SphereGeometry(spec.r, 22, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: spec.color,
          roughness: 0.55,
          metalness: 0.03,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(spec.x, spec.y, spec.z);
        mesh.rotation.set(i * 0.7, i * 1.1, i * 0.4);
        mesh.scale.set(1, 0.92 + (i % 3) * 0.04, 1);
        group.add(mesh);
      });

      // Leafy fronds give the mound an organic silhouette.
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x3d8b52,
        roughness: 0.7,
        side: THREE.DoubleSide,
      });
      for (let i = 0; i < 7; i += 1) {
        const angle = (i / 7) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.62, 4, 1, true), leafMat);
        leaf.position.set(Math.cos(angle) * 0.95, 1.02, Math.sin(angle) * 0.95);
        leaf.rotation.set(Math.cos(angle) * 0.5, -angle, Math.sin(angle) * -0.5);
        group.add(leaf);
      }

      // Ground shadow disc.
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(1.85, 40),
        new THREE.MeshBasicMaterial({ color: 0x116530, transparent: true, opacity: 0.11 })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -0.64;
      scene.add(shadow);

      // ── Camera orbit state ───────────────────────────────────────────
      let yaw = 0.4;
      let pitch = 0.18;
      let autoSpin = 0.0022;
      let dragging = false;
      let lastX = 0;
      let lastY = 0;

      const clampPitch = (v: number) => Math.max(-0.25, Math.min(0.85, v));

      const applyCamera = () => {
        const radius = 6.6;
        const cx = Math.sin(yaw) * Math.cos(pitch) * radius;
        const cz = Math.cos(yaw) * Math.cos(pitch) * radius;
        const cy = Math.sin(pitch) * radius * 0.62 + 1.5;
        camera.position.set(cx, cy, cz);
        camera.lookAt(0, 0.45, 0);
      };

      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.setPointerCapture(e.pointerId);
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        yaw -= dx * 0.0075;
        pitch = clampPitch(pitch + dy * 0.005);
      };
      const onPointerUp = (e: PointerEvent) => {
        dragging = false;
        if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      };

      // Arrow keys orbit; Home resets. Prevents page scroll only when the
      // canvas is the focused element, so native scrolling is never hijacked.
      const onKeyDown = (e: KeyboardEvent) => {
        const step = e.shiftKey ? 0.32 : 0.14;
        switch (e.key) {
          case 'ArrowLeft':
            yaw += step;
            break;
          case 'ArrowRight':
            yaw -= step;
            break;
          case 'ArrowUp':
            pitch = clampPitch(pitch - step * 0.6);
            break;
          case 'ArrowDown':
            pitch = clampPitch(pitch + step * 0.6);
            break;
          case 'Home':
            yaw = 0.4;
            pitch = 0.18;
            break;
          default:
            return;
        }
        e.preventDefault();
        applyCamera();
      };

      const onEnter = () => {
        autoSpin = 0;
      };
      const onLeave = () => {
        autoSpin = 0.0022;
      };

      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);
      canvas.addEventListener('keydown', onKeyDown);
      canvas.addEventListener('pointerenter', onEnter);
      canvas.addEventListener('pointerleave', onLeave);

      // ── Resize ───────────────────────────────────────────────────────
      const resize = () => {
        const rect = wrap.getBoundingClientRect();
        const w = Math.max(1, rect.width);
        const h = Math.max(1, rect.height);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      resize();

      // ── Render loop, paused when off-screen or tab hidden ────────────
      let raf = 0;
      let visible = true;
      let tabVisible = !document.hidden;

      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || !tabVisible) return;
        if (!dragging && autoSpin > 0) {
          yaw += autoSpin;
          applyCamera();
        }
        group.rotation.y = 0;
        renderer.render(scene, camera);
      };

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      io.observe(wrap);

      const onVisibility = () => {
        tabVisible = !document.hidden;
      };
      document.addEventListener('visibilitychange', onVisibility);

      applyCamera();
      setMode('webgl');
      loop();

      // Handle a user switching reduced-motion on mid-session.
      const onMotionChange = () => {
        if (motionQuery.matches) setMode('poster');
      };
      motionQuery.addEventListener('change', onMotionChange);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        motionQuery.removeEventListener('change', onMotionChange);
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointercancel', onPointerUp);
        canvas.removeEventListener('keydown', onKeyDown);
        canvas.removeEventListener('pointerenter', onEnter);
        canvas.removeEventListener('pointerleave', onLeave);
        scene.traverse((obj) => {
          const mesh = obj as import('three').Mesh;
          mesh.geometry?.dispose?.();
          const mat = mesh.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose?.();
        });
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="hero__stage" ref={wrapRef}>
      {mode === 'poster' ? (
        <div className="hero__poster">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={posterSrc} alt={posterAlt} width={900} height={900} loading="eager" />
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="hero__canvas"
          tabIndex={0}
          role="img"
          aria-label="Interactive 3D basket of fresh Kenyan produce. Drag to orbit, or use the arrow keys to rotate and the Home key to reset."
        />
      )}

      <p className="hero__stage-badge">
        {mode === 'poster' ? 'Static preview' : 'Live 3D'}
      </p>
      <p className="hero__stage-hint">
        {mode === 'poster' ? 'Reduced motion' : 'Drag or use arrow keys'}
      </p>
    </div>
  );
}
