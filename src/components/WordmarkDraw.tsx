'use client';

import { useEffect, useRef } from 'react';

interface WordmarkDrawProps {
  className?: string;
  /** Accessible name. Omit to render the mark as decorative. */
  title?: string;
  /** Seconds to complete the draw. */
  duration?: number;
  /** Only draw when the element scrolls into view (used inside farm cards). */
  drawOnView?: boolean;
}

/**
 * EFFECT-08 — Canaan Harvest wordmark that self-draws using stroke-dashoffset.
 *
 * Stroke lengths are measured at runtime, never hard-coded:
 *   • <path> / <circle>  → element.getTotalLength()
 *   • <text>             → element.getComputedTextLength()
 * Each length is written back as the --len custom property that the
 * stylesheets consume, so the dasharray always matches the real geometry
 * regardless of the font metrics or rendering engine in use.
 */
export default function WordmarkDraw({
  className,
  title,
  duration = 1.3,
  drawOnView = false,
}: WordmarkDrawProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const measure = () => {
      svg.querySelectorAll<SVGGeometryElement>('path, circle, line, polyline').forEach((el) => {
        let len = 0;
        try {
          len = el.getTotalLength();
        } catch {
          len = 400; // defensive: detached or unsupported
        }
        el.style.setProperty('--len', String(Math.ceil(len)));
      });

      svg.querySelectorAll<SVGTextElement>('text').forEach((el) => {
        let len = 0;
        try {
          len = el.getComputedTextLength();
        } catch {
          len = 400;
        }
        el.style.setProperty('--len', String(Math.ceil(len)));
      });
    };

    // Measure once fonts have settled so text metrics are final.
    measure();
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    svg.style.setProperty('--draw-duration', `${duration}s`);

    if (!drawOnView) {
      svg.setAttribute('data-draw', 'run');
      return;
    }

    const target = rootRef.current ?? svg;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            svg.setAttribute('data-draw', 'run');
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, [duration, drawOnView]);

  return (
    <span ref={rootRef} className={className}>
      <svg
        ref={svgRef}
        viewBox="0 0 320 80"
        role={title ? 'img' : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
        focusable="false"
        style={{ width: '100%', height: 'auto' }}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Monogram: field ring, seedling leaf, stem */}
          <circle cx="40" cy="40" r="31" />
          <path d="M40 58 C 26 50, 24 32, 40 22 C 56 32, 54 50, 40 58 Z" />
          <path d="M40 58 L 40 31" />
          {/* Horizon / field row — a ground line below the ring, so it reads
              as the field the seedling stands in rather than a bar crossing
              the circle. Geometry mirrors public/icons/wordmark.svg. */}
          <path d="M21 75 H 59" />
        </g>

        {/* Wordmark lettering. Stroked, so it draws like the paths above. */}
        <text
          x="92"
          y="44"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={0.6}
          fontFamily="var(--heading-font)"
          fontSize="30"
          letterSpacing="2.5"
        >
          CANAAN
        </text>
        <text
          x="92"
          y="70"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.9}
          fontFamily="var(--default-font)"
          fontSize="13"
          fontWeight={600}
          letterSpacing="6.4"
        >
          HARVEST
        </text>
      </svg>
    </span>
  );
}
