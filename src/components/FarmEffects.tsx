'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import WordmarkDraw from './WordmarkDraw';

/* ============================================================================
   EFFECT-07 — farm field line-art with growth lines looping in viewport
   ========================================================================= */
export function FieldLineArt() {
  const rows = [0, 1, 2, 3, 4];

  return (
    <div className="effect07" style={{ width: '100%' }}>
      <svg viewBox="0 0 240 180" role="img" aria-label="Canaan farm field animation.">
        {/* horizon */}
        <path className="field-row" d="M8 132 H 232" fill="none" />
        <path className="field-row" d="M20 148 H 220" fill="none" />

        {/* field furrows receding to the horizon */}
        {rows.map((r) => (
          <line
            key={r}
            className="field-row"
            x1={120 + (r - 2) * 28}
            y1="132"
            x2={120 + (r - 2) * 78}
            y2="44"
            strokeLinecap="round"
          />
        ))}

        {/* growth lines: crops rising, one per furrow */}
        {rows.map((r) => {
          const baseX = 120 + (r - 2) * 52;
          const baseY = 96 - Math.abs(r - 2) * 6;
          const topY = baseY - 30;
          return (
            <g key={`g${r}`}>
              <path
                className="growth-line"
                d={`M${baseX} ${baseY} L${baseX} ${topY}`}
                style={{ ['--i' as string]: r, ['--len' as string]: 30 }}
              />
              <path
                className="growth-line"
                d={`M${baseX} ${topY + 8} q -13 -4 -15 -14`}
                style={{ ['--i' as string]: r, ['--len' as string]: 22 }}
              />
              <path
                className="growth-line"
                d={`M${baseX} ${topY + 12} q 13 -4 15 -14`}
                style={{ ['--i' as string]: r, ['--len' as string]: 22 }}
              />
            </g>
          );
        })}

        {/* sun */}
        <circle cx="198" cy="34" r="13" fill="none" stroke="#d9a13a" strokeWidth="2" />
      </svg>
    </div>
  );
}

/* ============================================================================
   EFFECT-09 — SVG morph cycling seed → sprout → leaf
   Matched point counts: every shape is built from the same four anchor
   points, so the interpolation is always point-for-point.
   ========================================================================= */
type Pt = { x: number; y: number };

const SHAPES: { label: string; pts: Pt[] }[] = [
  {
    label: 'Seed',
    pts: [
      { x: 60, y: 20 },
      { x: 72, y: 60 },
      { x: 60, y: 100 },
      { x: 48, y: 60 },
    ],
  },
  {
    label: 'Sprout',
    pts: [
      { x: 60, y: 26 },
      { x: 80, y: 62 },
      { x: 60, y: 96 },
      { x: 44, y: 58 },
    ],
  },
  {
    label: 'Leaf',
    pts: [
      { x: 60, y: 16 },
      { x: 92, y: 54 },
      { x: 60, y: 96 },
      { x: 34, y: 50 },
    ],
  },
];

/** Catmull-Rom → cubic Bézier, closed. Always yields 4 curve segments. */
function smoothClosedPath(pts: Pt[]): string {
  const n = pts.length;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n; i += 1) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return `${d} Z`;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function MorphCycle() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(false);

  // Interpolated anchor points, animated with rAF.
  const ptsRef = useRef<Pt[]>(SHAPES[0].pts.map((p) => ({ ...p })));
  const fromRef = useRef<Pt[]>(SHAPES[0].pts.map((p) => ({ ...p })));
  const toRef = useRef<Pt[]>(SHAPES[1].pts.map((p) => ({ ...p })));
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const [path, setPath] = useState(() => smoothClosedPath(SHAPES[0].pts));

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Morph to a target shape over ~420ms. Reversible in either direction. */
  const morphTo = useCallback(
    (target: number, duration = 420) => {
      if (reduced) {
        setPath(smoothClosedPath(SHAPES[target].pts));
        return;
      }
      fromRef.current = ptsRef.current.map((p) => ({ ...p }));
      toRef.current = SHAPES[target].pts.map((p) => ({ ...p }));
      startRef.current = performance.now();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      const step = () => {
        const elapsed = performance.now() - startRef.current;
        const t = Math.min(1, elapsed / duration);
        // easeInOutCubic
        const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

        ptsRef.current = fromRef.current.map((p, i) => ({
          x: lerp(p.x, toRef.current[i].x, e),
          y: lerp(p.y, toRef.current[i].y, e),
        }));
        setPath(smoothClosedPath(ptsRef.current));

        if (t < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [reduced]
  );

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  /* Advance one step while hovered / focused; return to seed on exit. */
  const handleEnter = useCallback(() => {
    setActive(true);
    const next = (index + 1) % SHAPES.length;
    setIndex(next);
    morphTo(next);
  }, [index, morphTo]);

  const handleLeave = useCallback(() => {
    setActive(false);
    setIndex(0);
    morphTo(0);
  }, [morphTo]);

  /* Reduced motion → three static shapes crossfading (CSS transition). */
  if (reduced) {
    return (
      <div className="effect09" style={{ width: 150, height: 150, position: 'relative' }}>
        {SHAPES.map((shape, i) => (
          <svg
            key={shape.label}
            viewBox="0 0 120 120"
            style={{
              position: i === 0 ? 'relative' : 'absolute',
              inset: i === 0 ? undefined : 0,
              opacity: index === i ? 1 : 0,
              transition: 'opacity 320ms linear',
            }}
            aria-hidden="true"
            focusable="false"
          >
            <path className="morph-fill" d={smoothClosedPath(shape.pts)} />
            <path className="morph-shape" d={smoothClosedPath(shape.pts)} />
          </svg>
        ))}
        <span className="morph-label" style={{ position: 'absolute', bottom: -18, fontSize: 11 }}>
          {SHAPES[index].label}
        </span>
      </div>
    );
  }

  return (
    <div
      className="effect09"
      style={{ width: 150, height: 150, position: 'relative' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
      role="img"
      aria-label={`Seedling shape morph, currently showing ${SHAPES[index].label}.`}
    >
      <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }} aria-hidden="true" focusable="false">
        <path className="morph-fill" d={path} />
        <path className="morph-shape" d={path} />
      </svg>
      <span
        className="morph-label"
        aria-hidden="true"
        style={{ position: 'absolute', bottom: -18, left: 0, right: 0, textAlign: 'center', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--default-50)' }}
      >
        {SHAPES[index].label}
      </span>
    </div>
  );
}

/* ============================================================================
   EFFECT-13 — Kenyan farmer mascot, waving, reacts to hover and focus
   Decorative (aria-hidden). Static pose under reduced-motion.
   ========================================================================= */
export function FarmerMascot({ className }: { className?: string }) {
  return (
    <div className={className ?? 'effect13'} aria-hidden="true">
      <svg viewBox="0 0 140 150" focusable="false">
        <g fill="none" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          {/* head */}
          <circle cx="74" cy="46" r="21" fill="#a86b3c" stroke="#7d4c28" />
          {/* hat */}
          <path d="M50 34 q 24 -18 48 0" fill="none" stroke="#c99a52" strokeWidth={5} />
          <path d="M44 35 h 60" stroke="#c99a52" strokeWidth={5} />
          {/* eyes */}
          <circle cx="67" cy="44" r="2.6" fill="#2b1a10" stroke="none" />
          <circle cx="81" cy="44" r="2.6" fill="#2b1a10" stroke="none" />
          {/* smile */}
          <path className="mascot-smile" d="M66 55 q 8 7 16 0" stroke="#2b1a10" strokeWidth={2.2} />
          {/* neck + body */}
          <path d="M74 67 v 8" stroke="#7d4c28" />
          <path d="M52 120 q 0 -40 22 -45 q 22 5 22 45 Z" fill="#2f8f4e" stroke="#1f6b39" />
          {/* left arm (still) */}
          <path d="M54 88 q -14 6 -16 22" stroke="#7d4c28" />
          {/* right arm (waves) */}
          <g className="mascot-arm">
            <path d="M96 88 q 14 -6 17 -24" stroke="#7d4c28" />
            <circle cx="114" cy="60" r="6" fill="#a86b3c" stroke="#7d4c28" />
          </g>
          {/* legs */}
          <path d="M64 120 v 18" stroke="#4a3320" />
          <path d="M84 120 v 18" stroke="#4a3320" />
          {/* produce held */}
          <circle cx="38" cy="112" r="7" fill="#d94f3d" stroke="#a83a2c" />
          <circle cx="48" cy="118" r="5.5" fill="#2f8f4e" stroke="#1f6b39" />
        </g>
      </svg>
    </div>
  );
}

/* ============================================================================
   EFFECT-14 — faux-3D crate with bounded pointer tilt (no WebGL)
   ========================================================================= */
export function Faux3DCrate() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    // Bounded to ±12° so the crate never distorts past recognition.
    el.style.setProperty('--tilt-y', (nx * 24).toFixed(2));
    el.style.setProperty('--tilt-x', (-ny * 24).toFixed(2));
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--tilt-y', '0');
    el.style.setProperty('--tilt-x', '0');
  }, []);

  return (
    <div className="effect14" style={{ display: 'grid', placeItems: 'center' }}>
      <div
        ref={ref}
        className="crate"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ ['--tilt-x' as string]: 0, ['--tilt-y' as string]: 0 }}
      >
        <div className="crate-layer crate-layer--back" />
        <div className="crate-layer crate-layer--mid">
          {Array.from({ length: 8 }).map((_, i) => (
            <span className="crate-produce" key={i} />
          ))}
        </div>
        <div className="crate-layer crate-layer--front">
          {Array.from({ length: 12 }).map((_, i) => (
            <span className="crate-produce" key={i} />
          ))}
        </div>
        {/* Flat, single-layer version rendered only under reduced-motion */}
        <div className="crate-layer crate-layer--flat" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span className="crate-produce" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   EFFECT-16 — mixed-media collage: photo cut-out + vector soil + grain
   ========================================================================= */
export function MixedMediaCollage() {
  return (
    <div
      className="effect16"
      style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="effect16__photo"
        src="/photos/farm/soil-cultivation.jpg"
        alt="Farmers working the soil with hand tools on a partner farm"
        width={480}
        height={360}
        loading="lazy"
        decoding="async"
      />

      {/* vector soil texture */}
      <svg className="effect16__soil" viewBox="0 0 200 70" aria-hidden="true" focusable="false">
        <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" opacity={0.55}>
          <path d="M4 24 q 22 -14 44 0 t 44 0 t 44 0 t 44 0" />
          <path d="M4 44 q 22 -14 44 0 t 44 0 t 44 0 t 44 0" />
          <path d="M4 62 q 22 -12 44 0 t 44 0 t 44 0 t 44 0" opacity={0.4} />
        </g>
      </svg>

      {/* aria-hidden grain overlay */}
      <span className="effect16__grain" aria-hidden="true" />
    </div>
  );
}

/* ============================================================================
   EFFECT-17 — liquid gooey blob, bounded SVG filter region
   ========================================================================= */
export function LiquidBlob() {
  return (
    <div className="effect17" style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%' }}>
      <span className="effect17__blobs" aria-hidden="true">
        <span className="effect17__blob effect17__blob--a" />
        <span className="effect17__blob effect17__blob--b" />
        <span className="effect17__blob effect17__blob--c" />
      </span>
      <span className="effect17__content" aria-hidden="true">
        Goodness,
        <br />
        gathered
      </span>
    </div>
  );
}

/* ============================================================================
   EFFECT-19 — isometric farm scene assembling on scroll
   True 120° axes: standard 2:1 isometric projection at 30°.
   ========================================================================= */
const ISO_COS = Math.cos(Math.PI / 6); // 30°
const ISO_SIN = Math.sin(Math.PI / 6);

function iso(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * ISO_COS, (x + y) * ISO_SIN - z];
}

/** Builds a filled isometric box (top + left + right faces). */
function isoBox(x: number, y: number, w: number, d: number, h: number) {
  const [ax, ay] = iso(x, y, h);
  const [bx, by] = iso(x + w, y, h);
  const [cx, cy] = iso(x + w, y + d, h);
  const [dx, dy] = iso(x, y + d, h);
  const [ex, ey] = iso(x + w, y + d, 0);
  const [fx, fy] = iso(x + w, y, 0);
  const [gx, gy] = iso(x, y + d, 0);

  return {
    top: `M${ax} ${ay} L${bx} ${by} L${cx} ${cy} L${dx} ${dy} Z`,
    right: `M${bx} ${by} L${cx} ${cy} L${ex} ${ey} L${fx} ${fy} Z`,
    left: `M${dx} ${dy} L${cx} ${cy} L${ex} ${ey} L${gx} ${gy} Z`,
  };
}

export function IsometricFarm() {
  const baseY = 96;
  const ox = 120;

  const farmhouse = isoBox(70, 20, 34, 26, 30);
  const barn = isoBox(16, 44, 26, 22, 20);
  const trough = isoBox(120, 30, 18, 14, 9);

  // Irrigation channels — flat ribbons running along two axes.
  const channelA = `M${ox + iso(8, 12)[0]} ${baseY + iso(8, 12)[1]} L${ox + iso(96, 12)[0]} ${baseY + iso(96, 12)[1]}`;
  const channelB = `M${ox + iso(8, 12)[0]} ${baseY + iso(8, 12)[1]} L${ox + iso(8, 84)[0]} ${baseY + iso(8, 84)[1]}`;
  const channelC = `M${ox + iso(60, 8)[0]} ${baseY + iso(60, 8)[1]} L${ox + iso(60, 88)[0]} ${baseY + iso(60, 88)[1]}`;

  // Field plots — a 3×3 grid of low boxes on true iso axes.
  const plots: { x: number; y: number }[] = [];
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      plots.push({ x: 14 + c * 20, y: 62 + r * 14 });
    }
  }

  let partIndex = 0;

  return (
    <div className="effect19" style={{ width: '100%' }}>
      <svg viewBox="0 0 240 180" role="img" aria-label="Isometric illustration of a Canaan Harvest farm">
        <g transform={`translate(${ox}, ${baseY - 40})`}>
          {/* ground plate */}
          <g className="iso-part" style={{ ['--i' as string]: partIndex++ }}>
            <path
              d={`M${iso(0, 0)[0]} ${iso(0, 0)[1]} L${iso(140, 0)[0]} ${iso(140, 0)[1]} L${iso(140, 110)[0]} ${iso(140, 110)[1]} L${iso(0, 110)[0]} ${iso(0, 110)[1]} Z`}
              fill="color-mix(in srgb, var(--accent-color), white 90%)"
              stroke="color-mix(in srgb, var(--accent-color), transparent 70%)"
              strokeWidth="1.2"
            />
          </g>

          {/* irrigation channels */}
          {[channelA, channelB, channelC].map((d, i) => (
            <path
              key={i}
              className="iso-part"
              style={{ ['--i' as string]: partIndex++ }}
              d={d}
              fill="none"
              stroke="#4f9fd9"
              strokeWidth="2.6"
              strokeLinecap="round"
              opacity={0.75}
            />
          ))}

          {/* field plots */}
          {plots.map((plot, i) => {
            const box = isoBox(plot.x, plot.y, 16, 10, 4);
            return (
              <g key={i}>
                <path
                  className="iso-part"
                  style={{ ['--i' as string]: partIndex++ }}
                  d={box.top}
                  fill="color-mix(in srgb, var(--accent-color), white 62%)"
                />
                <path
                  className="iso-part"
                  style={{ ['--i' as string]: partIndex++ }}
                  d={box.right}
                  fill="color-mix(in srgb, var(--accent-color), white 44%)"
                />
                <path
                  className="iso-part"
                  style={{ ['--i' as string]: partIndex++ }}
                  d={box.left}
                  fill="color-mix(in srgb, var(--accent-color), white 30%)"
                />
              </g>
            );
          })}

          {/* barn */}
          <path className="iso-part" style={{ ['--i' as string]: partIndex++ }} d={barn.top} fill="#c99a52" />
          <path className="iso-part" style={{ ['--i' as string]: partIndex++ }} d={barn.right} fill="#a87f45" />
          <path className="iso-part" style={{ ['--i' as string]: partIndex++ }} d={barn.left} fill="#8f6a37" />

          {/* trough */}
          <path className="iso-part" style={{ ['--i' as string]: partIndex++ }} d={trough.top} fill="#9fb8a4" />
          <path className="iso-part" style={{ ['--i' as string]: partIndex++ }} d={trough.right} fill="#7f9a86" />
          <path className="iso-part" style={{ ['--i' as string]: partIndex++ }} d={trough.left} fill="#6a8571" />

          {/* farmhouse */}
          <path className="iso-part" style={{ ['--i' as string]: partIndex++ }} d={farmhouse.top} fill="#e2d3b8" />
          <path className="iso-part" style={{ ['--i' as string]: partIndex++ }} d={farmhouse.right} fill="#c9b699" />
          <path className="iso-part" style={{ ['--i' as string]: partIndex++ }} d={farmhouse.left} fill="#b0a086" />
          {/* roof */}
          <path
            className="iso-part"
            style={{ ['--i' as string]: partIndex++ }}
            d={`M${iso(70, 20, 30)[0]} ${iso(70, 20, 30)[1]} L${iso(87, 33, 46)[0]} ${iso(87, 33, 46)[1]} L${iso(104, 20, 30)[0]} ${iso(104, 20, 30)[1]} Z`}
            fill="#a8452f"
          />
        </g>
      </svg>
    </div>
  );
}

/* ============================================================================
   EFFECT-21 — hand-drawn doodle of sun, rain and growing plants
   Decorative only; sits clear of any label.
   ========================================================================= */
export function HandDrawnDoodle() {
  return (
    <div className="effect21" style={{ width: '100%' }} aria-hidden="true">
      <svg viewBox="0 0 240 180" focusable="false">
        {/* sun */}
        <circle className="doodle-sunray" cx="52" cy="46" r="18" fill="none" style={{ ['--len' as string]: 113 }} />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <line
              key={i}
              className="doodle-sunray"
              x1={52 + Math.cos(a) * 25}
              y1={46 + Math.sin(a) * 25}
              x2={52 + Math.cos(a) * 34}
              y2={46 + Math.sin(a) * 34}
              style={{ ['--len' as string]: 9, ['--i' as string]: i }}
            />
          );
        })}

        {/* cloud + rain */}
        <path
          className="doodle-stroke"
          d="M136 52 q 6 -16 24 -12 q 8 -12 24 -2 q 16 -4 16 12 q 0 10 -14 10 h -40 q -14 0 -10 -8 Z"
          style={{ ['--len' as string]: 160 }}
        />
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            className="doodle-stroke"
            x1={150 + i * 16}
            y1={72}
            x2={144 + i * 16}
            y2={92}
            style={{ ['--len' as string]: 22, ['--i' as string]: i + 1 }}
          />
        ))}

        {/* growing plants */}
        {[40, 96, 152, 208].map((x, i) => (
          <g key={x} className="doodle-stroke" style={{ ['--len' as string]: 60, ['--i' as string]: i }}>
            <path className="doodle-stroke" d={`M${x} 162 L${x} 132`} style={{ ['--len' as string]: 30, ['--i' as string]: i }} />
            <path className="doodle-stroke" d={`M${x} 142 q -14 -4 -16 -16`} style={{ ['--len' as string]: 24, ['--i' as string]: i }} />
            <path className="doodle-stroke" d={`M${x} 146 q 14 -4 16 -16`} style={{ ['--len' as string]: 24, ['--i' as string]: i }} />
          </g>
        ))}

        {/* ground */}
        <path className="doodle-stroke" d="M14 164 q 30 -8 60 0 t 60 0 t 60 0 t 40 0" style={{ ['--len' as string]: 220 }} />
      </svg>
    </div>
  );
}

/* ============================================================================
   EFFECT-31 — stop-motion sprite (single sheet request, halts off-screen)
   ========================================================================= */
export function StopMotionSprite() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setInView(entry.isIntersecting));
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="effect31" ref={ref} style={{ display: 'grid', placeItems: 'center' }}>
      <span
        className={`effect31__sprite${inView ? ' is-playing' : ''}`}
        role="img"
        aria-label="Stop-motion animation of a seed growing into a plant"
        style={{ animationPlayState: inView ? 'running' : 'paused' }}
      />
    </div>
  );
}

/* ============================================================================
   Card 2 — reuses the self-drawn wordmark (EFFECT-08)
   ========================================================================= */
export function WordmarkCardEffect() {
  return (
    <div className="effect08" style={{ display: 'grid', placeItems: 'center', width: '100%' }}>
      <WordmarkDraw className="wordmark effect08__wordmark" drawOnView duration={1.3} />
    </div>
  );
}
